import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import { sendEmail } from '../configs/sendgridConfig.js';

export const requestTour = async (req, res) => {
  const { name, email, phoneNumber, leaseType, fromDate, toDate, message } =
    req.body;
  if (
    !name ||
    !email ||
    !phoneNumber ||
    !leaseType ||
    !fromDate ||
    !toDate ||
    !message
  ) {
    throw new BadRequestError('Please provide all required fields');
  }

  const requestNewTour = await prisma.request.create({
    data: {
      name,
      email,
      phoneNumber,
      leaseType,
      userId: req.user.userId,
      fromDate: new Date(fromDate).toISOString(),
      toDate: new Date(toDate).toISOString(),
      message,
    },
  });
  const emailSubject = 'You requested a new tour!';
  const emailBody = `
    <p>Hi ${req.user.name}</p>
    <p>Thank you for requesting a new tour. These are your request details:</p>
    <h3>lease ${requestNewTour.leaseType}</h3>
    <h3>from ${requestNewTour.fromDate}</h3>
    <h3>to ${requestNewTour.toDate}</h3>
  `;
  await sendEmail(requestNewTour.email, emailSubject, emailBody);
  res.status(StatusCodes.CREATED).json({ requestNewTour });
};

export const getAllRequests = async (req, res) => {
  const requests = await prisma.request.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ requests });
};

export const getRequestById = async (req, res) => {
  const { id: requestId } = req.params;

  const request = await prisma.request.findUnique({
    where: { id: parseInt(requestId, 10) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!request) {
    throw new NotFoundError(`No requests found with this id ${requestId}`);
  }
};
