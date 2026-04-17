import { redirect } from "next/navigation";

// A raiz do app redireciona direto para o diagnóstico
export default function Home() {
  redirect("/diagnostico");
}
