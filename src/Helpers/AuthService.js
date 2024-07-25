import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  // SignUpCommand,
  // ConfirmSignUpCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "./config.json";

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});

export default class AuthService {
  static async ingresar(username, password) {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: config.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    try {
      const command = new InitiateAuthCommand(params);
      // const { AuthenticationResult } = await cognitoClient.send(command);
      const AuthenticationResult = await cognitoClient.send(command);
      return AuthenticationResult;
      // if (AuthenticationResult) {
      //   sessionStorage.setItem("idToken", AuthenticationResult.IdToken || "");
      //   sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || "");
      //   sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || "");
      //   return AuthenticationResult;
      // }
    } catch (error) {
      console.error("Error signing in: ", error);
      return null;
    }
  }

  static async cambiaContrasena(tokenSession, username, password) {
    const params = {
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      ClientId: config.clientId,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: password,
      },
      Session: tokenSession,
    };
    const command = new RespondToAuthChallengeCommand(params);
    try {
      const resp = await cognitoClient.send(command);
      console.log("Sign up success: ", resp);
    } catch (error) {
      console.error("Error renew  password: ", error);
      return null;
    }
  }

  /*
  static async signUp(email, password) {
    const params = {
      ClientId: config.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };
    try {
      const command = new SignUpCommand(params);
      const response = await cognitoClient.send(command);
      console.log("Sign up success: ", response);
      return response;
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  }

  static async confirmSignUp(username, code) {
    const params = {
      ClientId: config.clientId,
      Username: username,
      ConfirmationCode: code,
    };
    try {
      const command = new ConfirmSignUpCommand(params);
      await cognitoClient.send(command);
      console.log("User confirmed successfully");
      return true;
    } catch (error) {
      console.error("Error confirming sign up: ", error);
      throw error;
    }
  } */
}
