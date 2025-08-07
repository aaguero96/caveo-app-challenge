import * as awsException from '@aws-sdk/client-cognito-identity-provider';
import {
  Exception,
  InvalidParameterFormatException,
  InvalidPasswordFormatException,
  UserAlreadyExistException,
  UserInvalidCredentialException,
  UserNotConfirmedException,
  UserNotFoundException,
  UserWithoutAccessException,
} from '../exceptions';

export const handleAwsException = (err: unknown): Exception | undefined => {
  if (err instanceof awsException.UserNotFoundException) {
    return new UserNotFoundException();
  }

  if (err instanceof awsException.NotAuthorizedException) {
    switch (err.message) {
      case 'Incorrect username or password.':
        return new UserInvalidCredentialException();
      case 'User is disabled.':
        return new UserWithoutAccessException();
    }
  }

  if (err instanceof awsException.UserNotConfirmedException) {
    return new UserNotConfirmedException();
  }

  if (err instanceof awsException.InvalidPasswordException) {
    return new InvalidPasswordFormatException();
  }

  if (err instanceof awsException.InvalidParameterException) {
    return new InvalidParameterFormatException({
      invalidFormatMessage: err.message,
    });
  }

  if (err instanceof awsException.UsernameExistsException) {
    return new UserAlreadyExistException();
  }
};
