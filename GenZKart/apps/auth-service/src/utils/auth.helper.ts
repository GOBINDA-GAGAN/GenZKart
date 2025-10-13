import crypto from "crypto"
import { ValidationError } from "../../../../packages/error-handler"
import redis from "../../../../packages/libs/redis"
import { sendEmail } from "./sendMail"
import { NextFunction } from "express"
import { NetStream } from "ioredis/built/types"


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

export const CheckOtpRestrictions = async (email: string, next: NextFunction) => {
  if (await redis.get(`otp_lock:${email}`))
    return next(
      new ValidationError("Account locked due to multiple failed  attempts! Try again after 30 minutes"))
}

export const trackOtpRequest = async (email: string, next: NextFunction) => {

  const otpRequestKey = `otp_request_count:${email}`
  const otpRequests = parseInt((await redis.get(otpRequestKey)) || '0')
  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600)
    return next(new ValidationError("Too many request please try again after 1 hour"))
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600)

}

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  // set the otp in  
  await sendEmail(email, "Verify your email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_coolDown:${email}`, "true", "EX", 60)
}