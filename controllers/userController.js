import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { userService } from '../services';
import { createSendToken } from './tokenController';
import AppError from '../utils/appError';
import catchAsyncWrap from '../utils/catchAsyncWrap';

export const getAllUsers = catchAsyncWrap(async (req, res, next) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    status: 'success',
    users,
  });
});

export const signup = catchAsyncWrap(async (req, res, next) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    address: req.body.address,
    phone_number: req.body.phone_number,
    policy_agreed: req.body.policy_agreed,
  };
  Object.values(newUser).forEach(ele => {
    if (ele !== 'policy_agreed') {
      if (!ele) {
        return next(new AppError('불완전한 회원정보!', 400));
      }
    }
  });
  const result = await userService.createUserService(newUser);
  res.status(201).json({
    status: 'success',
    result,
  });
});

export const login = catchAsyncWrap(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('이메일과 패스워드를 주세요', 400));
  }
  const user = await userService.userLoginService(email, password);

  if (!user)
    return next(new AppError('이메일과 패스워드를 다시 확인해주세요', 401));

  createSendToken(user, 201, res);
});
