// Webhook para receber notificações do Mercado Pago
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    console.log('Webhook recebido:', { type, data });

    // Verificar se é uma notificação de pagamento
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Aqui você pode implementar a lógica para:
      // 1. Verificar o status do pagamento
      // 2. Atualizar a assinatura do usuário
      // 3. Enviar email de confirmação
      // 4. Registrar no banco de dados
      
      console.log('Pagamento processado:', paymentId);
      
      // Exemplo de verificação do pagamento
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      });

      if (paymentResponse.ok) {
        const payment = await paymentResponse.json();
        
        if (payment.status === 'approved') {
          console.log('Pagamento aprovado:', paymentId);
          // Implementar lógica de ativação da assinatura
        } else if (payment.status === 'rejected') {
          console.log('Pagamento rejeitado:', paymentId);
          // Implementar lógica de cancelamento
        }
      }
    }

    // Responder com sucesso para o Mercado Pago
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 