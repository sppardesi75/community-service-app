export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Welcome to the Community Service App
        </h1>
        <p className="text-lg text-gray-700">
          Start reporting issues, managing tickets, and improving your community.
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500">MongoDB is connected ✅</p>
        </div>
      </div>
    </div>
  );
}
