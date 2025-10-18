// Design Pattern interfaces following SOLID principles

import { Location, Notification } from '../types/models';
import { IValidationStrategy, ValidationResult } from './validation';

// Observer Pattern
export interface INotificationObserver {
  update(_notification: Notification): void;
}

export interface INotificationSubject {
  attach(_observer: INotificationObserver): void;
  detach(_observer: INotificationObserver): void;
  notify(_notification: Notification): void;
}

// Strategy Pattern
export interface ILocationValidator extends IValidationStrategy {
  validateProximity(
    _location1: Location,
    _location2: Location,
    _toleranceMeters: number
  ): ValidationResult;
}
