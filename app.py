import streamlit as st
import os
import json
import tempfile
from dotenv import load_dotenv

from database import init_db, get_db, Document, Defect, AuditLog, EmailLog
from ocr import extract_text
from agents import agent_parser, agent_auditor, agent_advisor

load_dotenv()

# ── Initialize database on startup ──
init_db()

# ── Page config ──
st.set_page_config(
    page_title="Financial Audit System",
    page_icon="📊",
    layout="wide"
)

st.title("📊 Financial Audit System")
st.caption("Upload invoices, receipts, or order lists — get instant audit reports")

# ════════════════════════════════════════
# SIDEBAR — Navigation
# ════════════════════════════════════════
page = st.sidebar.radio(
    "Navigate",
    ["📁 Upload & Audit", "📈 Dashboard", "📋 Audit Logs", "📬 Email History"]
)

# ════════════════════════════════════════
# PAGE 1 — Upload & Audit
# ════════════════════════════════════════
if page == "📁 Upload & Audit":
    st.header("Upload Document")

    doc_type = st.selectbox(
        "Document Type",
        ["invoice", "receipt", "order"]
    )

    uploaded_file = st.file_uploader(
        "Upload your document (PDF or Image)",
        type=["pdf", "jpg", "jpeg", "png"]
    )

    if uploaded_file and st.button("🔍 Extract & Audit", type="primary"):

        # ── Step 1: Save uploaded file temporarily ──
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=os.path.splitext(uploaded_file.name)[1]
        ) as tmp:
            tmp.write(uploaded_file.read())
            tmp_path = tmp.name

        # ── Step 2: OCR ──
        with st.spinner("📖 Reading document with OCR..."):
            raw_text = extract_text(tmp_path)

        st.subheader("📄 Extracted Text")
        st.text_area("Raw OCR Output", raw_text, height=150)

        # ── Guard: stop if OCR failed ──
        if raw_text.startswith("OCR Error:") or raw_text.startswith("PDF OCR Error:") or raw_text.startswith("Unsupported"):
            st.error(f"❌ OCR failed: {raw_text}")
            st.info("💡 Make sure Tesseract and Poppler are installed and TESSERACT_PATH / POPPLER_PATH are set in your .env file.")
            os.unlink(tmp_path)
            st.stop()

        # ── Step 3: Agent 1 — Parse ──
        with st.spinner("🤖 Agent 1: Structuring document data..."):
            extracted = agent_parser(raw_text, doc_type)

        st.subheader("🗂️ Structured Data")
        st.json(extracted)

        # ── Guard: stop if parsing failed ──
        if "error" in extracted:
            st.error("❌ Could not extract structured data from the document.")
            st.warning(f"Raw LLM response: {extracted.get('raw_response', 'No detail available.')}")
            os.unlink(tmp_path)
            st.stop()

        # ── Step 4: Save document to database ──
        db = get_db()
        vendor_name = extracted.get("vendor_name") or "Unknown"

        doc = Document(
            vendor_name  = vendor_name,
            doc_type     = doc_type,
            doc_id       = extracted.get("doc_id"),
            date         = extracted.get("date"),
            total_amount = extracted.get("total_amount"),
            raw_text     = raw_text,
            extracted    = json.dumps(extracted)
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # ── Step 5: Get past defect count for this vendor ──
        past_defect_count = db.query(Defect).filter(
            Defect.vendor_name == vendor_name
        ).count()

        # ── Step 6: Agent 2 — Audit ──
        with st.spinner("🔎 Agent 2: Auditing document..."):
            audit_result = agent_auditor(extracted, doc_type, past_defect_count)

        # ── Step 7: Save audit result ──
        audit_log = AuditLog(
            document_id  = doc.id,
            vendor_name  = vendor_name,
            status       = audit_result.get("status", "unknown"),
            defect_count = audit_result.get("defect_count", 0),
            remarks      = audit_result.get("remarks", "")
        )
        db.add(audit_log)

        for defect in audit_result.get("defects", []):
            d = Defect(
                document_id = doc.id,
                vendor_name = vendor_name,
                defect_type = defect.get("type", "unknown"),
                description = defect.get("description", "")
            )
            db.add(d)
        db.commit()

        # ── Step 8: Show audit result ──
        st.subheader("🔎 Audit Result")

        status = audit_result.get("status", "unknown").lower()
        remarks = audit_result.get("remarks", "")

        if status == "clean":
            st.success(f"✅ Status: CLEAN — {remarks}")
        elif status == "defective":
            st.warning(f"⚠️ Status: DEFECTIVE — {remarks}")
        elif status == "critical":
            st.error(f"🚨 Status: CRITICAL — {remarks}")
        else:
            st.info(f"ℹ️ Status: {status.upper()} — {remarks}")

        defects = audit_result.get("defects", [])
        if defects:
            st.write("**Defects Found:**")
            for defect in defects:
                st.write(f"- **{defect.get('type', 'unknown')}**: {defect.get('description', '')}")

        # ── Step 9: Agent 3 — Advisor ──
        with st.spinner("💡 Agent 3: Generating email suggestion..."):
            advice = agent_advisor(audit_result, vendor_name, past_defect_count)

        st.subheader("💡 Suggested Action")

        action = advice.get("action", "")
        if action == "release_payment":
            st.success("✅ Suggested: Release Payment")
        elif action == "last_warning":
            st.error("🚨 Suggested: Send Last Warning")
        else:
            st.warning("⚠️ Suggested: Send Formal Remarks")

        st.write(f"**Reason:** {advice.get('reasoning', '')}")

        # ── Step 10: Email draft ──
        st.subheader("📧 Draft Email")

        email_subject = st.text_input("Subject", value=advice.get("email_subject", ""))
        email_body    = st.text_area("Email Body", value=advice.get("email_body", ""), height=200)
        recipient     = st.text_input("Send to (email address)")

        col1, col2 = st.columns(2)

        with col1:
            if st.button("✉️ Send Email", type="primary"):
                if recipient:
                    try:
                        email_log = EmailLog(
                            vendor_name = vendor_name,
                            email_type  = action,
                            subject     = email_subject,
                            body        = email_body
                        )
                        db.add(email_log)
                        db.commit()
                        st.success("✅ Email logged successfully! (Configure SMTP in .env to actually send)")
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
                else:
                    st.warning("Please enter a recipient email address")

        with col2:
            if st.button("❌ Reject Suggestion"):
                st.info("Suggestion rejected. You can edit the email above and send manually.")

        # Cleanup temp file
        os.unlink(tmp_path)

# ════════════════════════════════════════
# PAGE 2 — Dashboard
# ════════════════════════════════════════
elif page == "📈 Dashboard":
    st.header("Finance Dashboard")

    db = get_db()

    total_docs     = db.query(Document).count()
    total_defects  = db.query(Defect).count()
    total_clean    = db.query(AuditLog).filter(AuditLog.status == "clean").count()
    total_critical = db.query(AuditLog).filter(AuditLog.status == "critical").count()

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("📁 Total Documents", total_docs)
    col2.metric("✅ Clean Audits",     total_clean)
    col3.metric("⚠️ Total Defects",   total_defects)
    col4.metric("🚨 Critical Cases",  total_critical)

    st.divider()

    st.subheader("⚠️ Defects by Vendor")
    vendors = db.query(Defect.vendor_name).distinct().all()

    if vendors:
        vendor_data = {}
        for (vendor,) in vendors:
            count = db.query(Defect).filter(Defect.vendor_name == vendor).count()
            vendor_data[vendor] = count

        import pandas as pd
        df = pd.DataFrame(
            list(vendor_data.items()),
            columns=["Vendor", "Defect Count"]
        )
        st.bar_chart(df.set_index("Vendor"))

        st.subheader("🏢 Vendor Health")
        for vendor, count in vendor_data.items():
            if count == 0:
                st.success(f"✅ {vendor} — Good standing")
            elif count < 3:
                st.warning(f"⚠️ {vendor} — {count} defects, monitor closely")
            else:
                st.error(f"🚨 {vendor} — {count} defects, CRITICAL")
    else:
        st.info("No defect data yet. Upload some documents first!")

# ════════════════════════════════════════
# PAGE 3 — Audit Logs
# ════════════════════════════════════════
elif page == "📋 Audit Logs":
    st.header("Audit Logs")

    db = get_db()
    logs = db.query(AuditLog).order_by(AuditLog.audited_at.desc()).all()

    if logs:
        import pandas as pd
        data = [{
            "ID":      l.id,
            "Vendor":  l.vendor_name,
            "Status":  l.status,
            "Defects": l.defect_count,
            "Remarks": l.remarks,
            "Date":    l.audited_at.strftime("%Y-%m-%d %H:%M")
        } for l in logs]
        st.dataframe(pd.DataFrame(data), use_container_width=True)
    else:
        st.info("No audit logs yet. Upload a document to get started!")

# ════════════════════════════════════════
# PAGE 4 — Email History
# ════════════════════════════════════════
elif page == "📬 Email History":
    st.header("Email History")

    db = get_db()
    emails = db.query(EmailLog).order_by(EmailLog.sent_at.desc()).all()

    if emails:
        for email in emails:
            with st.expander(f"📧 {email.subject} — {email.vendor_name} ({email.email_type})"):
                st.write(f"**Sent at:** {email.sent_at.strftime('%Y-%m-%d %H:%M')}")
                st.write(f"**Type:** {email.email_type}")
                st.write("**Body:**")
                st.write(email.body)
    else:
        st.info("No emails sent yet.")