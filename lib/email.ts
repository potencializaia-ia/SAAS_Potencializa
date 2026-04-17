import type { FormData, AnalysisResult } from "@/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  }).format(value);
}

export async function notifyNewLead(
  form:   FormData,
  result: AnalysisResult
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  // Lazy import para evitar erro no build
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const TO_EMAIL   = process.env.NOTIFY_EMAIL ?? "contato@potencializaia.com";
  const FROM_EMAIL = process.env.FROM_EMAIL   ?? "diagnostico@potencializaia.com";

  const automacoesList = result.automacoes
    .map(
      (a, i) =>
        `${i + 1}. <strong>${a.titulo}</strong> — ${formatCurrency(a.economiaMes)}/mês`
    )
    .join("<br/>");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:32px auto;">
    <tr>
      <td style="background:#001f3f;padding:32px;border-radius:12px 12px 0 0;text-align:center;">
        <p style="color:#ff851b;font-size:13px;margin:0 0 8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
          Novo Lead — Diagnóstico IA
        </p>
        <h1 style="color:#ffffff;font-size:26px;margin:0;font-weight:800;">
          ${form.nome} completou o diagnóstico
        </h1>
        <p style="color:#7fdbff;font-size:15px;margin:12px 0 0;">${form.empresa} · ${form.setor}</p>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:32px;">

        <h2 style="font-size:14px;font-weight:700;color:#001f3f;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 16px;">
          Informações de Contato
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr><td style="padding:6px 0;color:#555;font-size:14px;">Email: <a href="mailto:${form.email}" style="color:#ff851b;">${form.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#555;font-size:14px;">WhatsApp: <a href="https://wa.me/55${form.telefone.replace(/\D/g, "")}" style="color:#ff851b;">${form.telefone}</a></td></tr>
          <tr><td style="padding:6px 0;color:#555;font-size:14px;">Empresa: ${form.empresa}</td></tr>
          <tr><td style="padding:6px 0;color:#555;font-size:14px;">Setor: ${form.setor}</td></tr>
          <tr><td style="padding:6px 0;color:#555;font-size:14px;">Tamanho: ${form.tamanho} funcionários</td></tr>
          <tr><td style="padding:6px 0;color:#555;font-size:14px;">Orçamento: ${form.orcamento}</td></tr>
        </table>

        <h2 style="font-size:14px;font-weight:700;color:#001f3f;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 16px;">
          Resultado do Diagnóstico
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="background:#f0fdf4;padding:16px;text-align:center;border:1px solid #bbf7d0;">
              <div style="font-size:22px;font-weight:800;color:#16a34a;">${result.totalHorasMes}h</div>
              <div style="font-size:12px;color:#555;margin-top:4px;">Horas/mês economizadas</div>
            </td>
            <td style="background:#eff6ff;padding:16px;text-align:center;border:1px solid #bfdbfe;">
              <div style="font-size:22px;font-weight:800;color:#2563eb;">${formatCurrency(result.totalEconomiaMes)}</div>
              <div style="font-size:12px;color:#555;margin-top:4px;">Economia mensal</div>
            </td>
            <td style="background:#fff7ed;padding:16px;text-align:center;border:1px solid #fed7aa;">
              <div style="font-size:22px;font-weight:800;color:#ea580c;">${formatCurrency(result.totalRoi12meses)}</div>
              <div style="font-size:12px;color:#555;margin-top:4px;">ROI em 12 meses</div>
            </td>
          </tr>
        </table>

        <h2 style="font-size:14px;font-weight:700;color:#001f3f;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">
          Automações Sugeridas
        </h2>
        <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 24px;">
          ${automacoesList}
        </p>

        <div style="background:#fafafa;border-left:4px solid #ff851b;padding:16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
          <p style="font-size:12px;font-weight:700;color:#ff851b;margin:0 0 8px;text-transform:uppercase;">Principal Dor</p>
          <p style="font-size:14px;color:#333;margin:0;line-height:1.6;">${form.dor}</p>
        </div>

        <div style="text-align:center;margin-top:32px;">
          <a href="https://wa.me/55${form.telefone.replace(/\D/g, "")}"
             style="display:inline-block;background:#25d366;color:#ffffff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
            Responder pelo WhatsApp
          </a>
        </div>
      </td>
    </tr>

    <tr>
      <td style="background:#f4f4f5;padding:20px;border-radius:0 0 12px 12px;text-align:center;">
        <p style="font-size:12px;color:#999;margin:0;">
          Potencializa · Lead gerado em ${new Date().toLocaleString("pt-BR")}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from:    FROM_EMAIL,
    to:      [TO_EMAIL],
    subject: `Novo Lead: ${form.nome} (${form.empresa}) — ROI ${formatCurrency(result.totalRoi12meses)}/ano`,
    html,
  });
}
