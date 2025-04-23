import { UserTable } from "./components/user-table";

function App() {
  return (
    <div className="container mx-auto p-4 max-w-4xl h-screen">
      <h1 className="text-2xl font-bold mb-4">User Table</h1>
      <UserTable />
    </div>
  );
}

export default App;