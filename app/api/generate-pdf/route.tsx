import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { DiagnosticoPDF } from "@/lib/pdf-template";
import type { FormData, AnalysisResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { form, result }: { form: FormData; result: AnalysisResult } =
      await req.json();

    if (!form || !result) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Gera o PDF como buffer usando JSX
    const buffer = await renderToBuffer(
      <DiagnosticoPDF form={form} result={result} />
    );

    const filename = `Diagnostico-IA-${form.empresa.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;

    // Converte para Uint8Array para compatibilidade com NextResponse
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length":      uint8.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    return NextResponse.json(
      { error: "Falha ao gerar o PDF. Tente novamente." },
      { status: 500 }
    );
  }
}
