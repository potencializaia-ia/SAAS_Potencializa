// Esta route existe para testes manuais — a notificação real é disparada
// diretamente pela /api/analyze após salvar o lead.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "Email service is handled by /api/analyze" });
}
