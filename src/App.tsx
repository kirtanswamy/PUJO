import { Stage } from './components/Stage';
import { Caption } from './components/Caption';

export default function App() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4">
      <Stage />
      <Caption />
    </main>
  );
}
