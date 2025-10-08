import crypto from "crypto"
import { ValidationError } from "../../../../packages/error-handler"
import redis from "../../../../packages/libs/redis"
import { sendEmail } from "./sendMail"


export const validateRegisterData = (data: any, userType: 'user' | 'seller') => {

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const { name, email, password, phone_number, country } = data
  if (!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {

    throw new ValidationError("Missing required fields")
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!")
  }
}

export const CheckOtpRestrictions = async (email: string, next: NewableFunction) => {
  if (await redis.get(`otp_lock:${email}`))
    return next(
      new ValidationError("Account locked due to multiple failed  attempts! Try again after 30 minutes"))
}

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  // set the otp in  
  await sendEmail(email, "Verify your email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_coolDown:${email}`, "true", "EX", 60)
}