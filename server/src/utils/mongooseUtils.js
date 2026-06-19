import mongoose from 'mongoose';
import AppError from './appError.js';

/**
 * Validates and converts a string to a Mongoose ObjectId.
 * This helps prevent NoSQL injection by ensuring the input is a valid ObjectId.
 * 
 * @param {string} value - The potential ObjectId string
 * @param {string} fieldName - The name of the field (for error message)
 * @returns {mongoose.Types.ObjectId} - The casted ObjectId
 * @throws {AppError} - If the ID is invalid
 */
export const sanitizeObjectId = (value, fieldName = 'ID') => {
  if (!value) return null;

  const normalizedValue = String(value);

  if (!mongoose.Types.ObjectId.isValid(normalizedValue)) {
    throw new AppError(`Invalid ${fieldName}: ${normalizedValue}`, 400);
  }

  return new mongoose.Types.ObjectId(normalizedValue);
};
