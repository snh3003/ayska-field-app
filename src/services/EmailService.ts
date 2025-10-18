import { IEmailService } from '../interfaces/onboarding';

export class EmailService implements IEmailService {
  async sendWelcomeEmail(
    to: string,
    name: string,
    tempPassword: string
  ): Promise<boolean> {
    if (__DEV__) {
      console.log('📧 [MOCK EMAIL] Welcome');
      console.log(`To: ${to}, Name: ${name}, Password: ${tempPassword}`);
      console.log('Subject: Welcome to Ayska Field App');
      console.log('Body: Please change your password after first login.');
    }
    return true;
  }

  async sendAssignmentEmail(to: string, assignments: any[]): Promise<boolean> {
    if (__DEV__) {
      console.log('📧 [MOCK EMAIL] Assignment Notification');
      console.log(`To: ${to}`);
      console.log(`Subject: New Doctor Assignments`);
      console.log(
        `Body: You have ${assignments.length} new doctor assignments`
      );
    }
    return true;
  }
}
