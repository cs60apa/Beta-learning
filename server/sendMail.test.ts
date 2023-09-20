import sendMail  from "./utils/sendMail";

describe('sendMail', () => {
  it('should send an email', async () => {
    const options = {
      email: 'recipient@example.com',
      subject: 'Test Email',
      template: 'test.ejs',
      data: { name: 'John Doe' },
    };

    const result = await sendMail(options);

    expect(result).toBeDefined();
    expect(result.accepted).toContain(options.email);
    expect(result.response).toContain('250');
  });
});