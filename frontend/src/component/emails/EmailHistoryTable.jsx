/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import axios from "axios";

export default function EmailHistoryTable() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/email-history"
      );

      setEmails(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <div
          key={email.id}
          className="bg-slate-900 rounded-3xl p-6 border border-slate-800"
        >
          <h3 className="text-xl font-semibold text-white">
            {email.subject}
          </h3>

          <p className="text-violet-400 mt-2">
            {email.vendor_name}
          </p>

          <p className="text-slate-400 mt-1">
            Type: {email.email_type}
          </p>

          <p className="text-slate-300 mt-4">
            {email.body}
          </p>
        </div>
      ))}
    </div>
  );
}