"use client";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";

export default function MessagePage() {
    const router = useRouter();
  
    const handleSubmit = async () => {
      router.push("/chat");
    };

  const messages = [
    {
      university: "東京科学大学",
      department: "人材開発",
      professor: "山田教授",
      subject: "最短の火曜日はご予定いかがでしょうか",
    },
    {
      university: "東京科学大学",
      department: "人材開発",
      professor: "田中教授",
      subject: "最短の火曜日はご予定いかがでしょうか",
    },
    {
      university: "東京科学大学",
      department: "人材開発",
      professor: "佐藤教授",
      subject: "最短の火曜日はご予定いかがでしょうか",
    },
    // 追加で必要なメッセージをここに
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="メッセージ" />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">受信メッセージ一覧</h1>

        <div className="flex bg-white shadow rounded-lg overflow-hidden">
          {/* サイドバー */}
          <aside className="w-1/4 bg-gray-200 p-4">
            <ul className="space-y-4 text-sm font-medium text-gray-800">
              <li>📥 受信メール</li>
              <li className="ml-4">📨 すべてのメール（12）</li>
              <li className="ml-4">⭐ 重要なメール（5）</li>
              <li className="ml-4">🏷️ タグ（3）</li>
              <li className="mt-6">✉️ 送信メール</li>
              <li className="ml-4">📝 下書き（1）</li>
            </ul>
          </aside>

          {/* メッセージリスト */}
          <section className="w-3/4 p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded bg-gray-100 hover:bg-gray-200 transition"
                onClick={handleSubmit}
              >
                <div className="text-sm text-gray-700">
                  <div className="font-semibold">{msg.university}</div>
                  <div>
                    {msg.department} {msg.professor}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{msg.subject}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
