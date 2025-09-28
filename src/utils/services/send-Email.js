import nodemailer from "nodemailer";
import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";
import { connection } from "./redis.js";
const createOTP = customAlphabet(`0123456789zxcvbnmalksjdhfgqwretruop`, 6);

async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: `gmail`,
      auth: {
        pass: process.env.APP_PASSWORD,
        user: process.env.APP_GMAIL,
      },
      secure: true,
    });
    const Info = await transporter.sendMail({
      to: to,
      from: process.env.APP_GMAIL,
      subject: subject,
      html: html,
    });
    console.log(Info.response);
  } catch (err) {
    console.log(err);
  }
}

export const createAndSendOTP = async (email) => {
  const OTP = createOTP();
  const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">مرحبا بك!</h2>
            <p>شكراً لتسجيلك. الكود الخاص بك لتأكيد الحساب هو:</p>
            <h2 style="color: #191a1bff; text-align: center;">${OTP}</h2>
            <p>من فضلك أدخل هذا الكود في التطبيق لتفعيل حسابك.</p>
            <hr />
            <p style="font-size: 12px; color: #888;">إذا لم تطلب هذا الكود، تجاهل هذه الرسالة.</p>
          </div>
        </div>
      `;
  const hashOTP = await bcrypt.hash(OTP, parseInt(process.env.SALT));
  await connection.set(`otp_${email}`, hashOTP, "EX", 2 * 60);
  await sendEmail({
    to: email,
    subject: "confirmation Email",
    html: html,
  });
};
export const createAndSendOTP_password = async (email) => {
  const OTP = createOTP();
  const resetHtml = `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333;">طلب إعادة تعيين كلمة المرور</h2>
    <p style="font-size: 16px; color: #555;">لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. من فضلك استخدم رمز التحقق (OTP) أدناه لإتمام العملية:</p>
    <div style="margin: 20px 0; padding: 20px; background-color: #f1f5ff; border-radius: 8px; text-align: center;">
      <h1 style="font-size: 36px; letter-spacing: 4px; color: #007BFF;">${OTP}</h1>
    </div>
    <p style="font-size: 14px; color: #777;">الرمز صالح لفترة محدودة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p> 
  </div>
</div>`;
  const hashOTP = await bcrypt.hash(OTP, parseInt(process.env.SALT));
  await connection.set(`otp_reset:${email}`, hashOTP, "EX", 2 * 60);
  await sendEmail({
    to: email,
    subject: "reset password",
    html: resetHtml,
  });
};
export const bannedUser_email = async (email) => {
  const bannedHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #d9534f;">تم حظر حسابك</h2>
    <p style="font-size: 16px; color: #555;">
      نود إعلامك بأنه قد تم <strong style="color:#d9534f;">حظر حسابك</strong> مؤقتًا بسبب مخالفة سياسات الاستخدام.
    </p>
    <p style="font-size: 16px; color: #555;">
      إذا كنت تعتقد أن هذا الإجراء تم عن طريق الخطأ، يرجى التواصل مع فريق الدعم للمراجعة والمساعدة.
    </p>
    <div style="margin: 20px 0; padding: 20px; background-color: #fff3cd; border-radius: 8px; text-align: center; border: 1px solid #ffeeba;">
      <h3 style="color: #856404; margin: 0;">📩 تواصل معنا عبر البريد:</h3>
      <p style="font-size: 18px; color: #333; margin: 5px 0 0 0;">
        <a href="mailto:support@notes.com" style="color: #007BFF; text-decoration: none;">support@notes.com</a>
      </p>
    </div>
    <p style="font-size: 14px; color: #777;">
      نشكرك على تفهمك. فريق <strong>Notes</strong>.
    </p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p>
  </div>
</div>
`;
  await sendEmail({
    to: email,
    subject: "تم حظر حسابك",
    html: bannedHtml,
  });
};

export const orderPaid_email = async (email, orderId) => {
  const paidHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #28a745;">✅ تم تأكيد الدفع</h2>
    <p style="font-size: 16px; color: #555;">
      نشكرك على إتمام عملية الدفع بنجاح. طلبك قيد المعالجة الآن.
    </p>
    <div style="margin: 20px 0; padding: 20px; background-color: #e9f7ef; border-radius: 8px; text-align: center; border: 1px solid #c3e6cb;">
      <h3 style="color: #155724; margin: 0;">📦 جاري تجهيز طلبك للشحن</h3>
      <p style="font-size: 15px; color: #333; margin: 5px 0 0 0;">
        سنتواصل معك عند شحن الطلب.
      </p>
    </div>
    <p style="font-size: 14px; color: #777;">
      شكراً لاختيارك <strong>Notes</strong>. نتمنى لك تجربة تسوق رائعة.
    </p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p>
  </div>
</div`;
  await sendEmail({
    to: email,
    subject: "✅ تم الدفع بنجاح - طلبك قيد المعالجة",
    html: paidHtml,
  });
};
