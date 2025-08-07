import * as awsException from '@aws-sdk/client-cognito-identity-provider';
import {
  InvalidParameterFormatException,
  InvalidPasswordFormatException,
  UserAlreadyExistException,
  UserInvalidCredentialException,
  UserNotConfirmedException,
  UserNotFoundException,
  UserWithoutAccessException,
} from '../../exceptions';
import { handleAwsException } from '..';

describe('handleAwsException', () => {
  it('return equivalent when is instanceof awsException.UserNotFoundException', () => {
    const response = handleAwsException(
      new awsException.UserNotFoundException({
        message: 'mock',
        $metadata: {},
      }),
    );

    expect(response).toBeInstanceOf(UserNotFoundException);
  });

  it('return equivalent when is instanceof awsException.UserNotConfirmedException', () => {
    const response = handleAwsException(
      new awsException.UserNotConfirmedException({
        message: 'mock',
        $metadata: {},
      }),
    );

    expect(response).toBeInstanceOf(UserNotConfirmedException);
  });

  describe('return equivalent when is instanceof awsException.NotAuthorizedException', () => {
    it('message equals to "Incorrect username or password."', () => {
      const response = handleAwsException(
        new awsException.NotAuthorizedException({
          message: 'Incorrect username or password.',
          $metadata: {},
        }),
      );

      expect(response).toBeInstanceOf(UserInvalidCredentialException);
    });

    it('message equals to "User is disabled."', () => {
      const response = handleAwsException(
        new awsException.NotAuthorizedException({
          message: 'User is disabled.',
          $metadata: {},
        }),
      );

      expect(response).toBeInstanceOf(UserWithoutAccessException);
    });
  });

  it('return equivalent when is instanceof awsException.InvalidPasswordException', () => {
    const response = handleAwsException(
      new awsException.InvalidPasswordException({
        message: 'mock',
        $metadata: {},
      }),
    );

    expect(response).toBeInstanceOf(InvalidPasswordFormatException);
  });

  it('return equivalent when is instanceof awsException.InvalidParameterException', () => {
    const response = handleAwsException(
      new awsException.InvalidParameterException({
        message: 'mock',
        $metadata: {},
      }),
    );

    expect(response).toBeInstanceOf(InvalidParameterFormatException);
  });

  it('return equivalent when is instanceof awsException.UsernameExistsException', () => {
    const response = handleAwsException(
      new awsException.UsernameExistsException({
        message: 'mock',
        $metadata: {},
      }),
    );

    expect(response).toBeInstanceOf(UserAlreadyExistException);
  });

  it('return undefined when instance is not mapped', () => {
    const response = handleAwsException({});

    expect(response).toBeUndefined();
  });
});
