interface ClaudeDocRef {
  set(data: unknown): Promise<void>;
}

interface ClaudeCollection {
  doc(id: string): ClaudeDocRef;
  onSnapshot(next: (snap: { docs: { id: string; data(): any }[] }) => void, error?: () => void): void;
}

interface ClaudeRuntime {
  use(name: "sample"): Promise<any>;
  use(name: "db"): Promise<{ collection(name: string): ClaudeCollection } | null>;
  use(name: string): Promise<any>;
}

interface Window {
  claude?: ClaudeRuntime;
}
