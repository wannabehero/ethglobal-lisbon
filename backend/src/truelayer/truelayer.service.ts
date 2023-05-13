import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Account, ApiResponse, Balance } from './types';

const AUTH_BASE_URL = 'https://auth.truelayer-sandbox.com';
const DATA_BASE_URL = 'https://api.truelayer-sandbox.com';

@Injectable()
export class TruelayerService {
  private readonly logger = new Logger(TruelayerService.name);

  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(config: ConfigService) {
    this.clientId = config.get('TRUELAYER_CLIENT_ID');
    this.clientSecret = config.get('TRUELAYER_CLIENT_SECRET');
    this.redirectUri = config.get('TRUELAYER_REDIRECT_URI');
  }

  getAuthUrl(): string {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: 'accounts balance',
      redirect_uri: this.redirectUri,
      providers: 'uk-cs-mock uk-ob-all uk-oauth-all',
    });
    return `${AUTH_BASE_URL}/?${query.toString()}`;
  }

  async getAccessToken(code: string): Promise<string> {
    const response = await fetch(`${AUTH_BASE_URL}/connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
      }),
    });
    const { access_token } = await response.json();
    return access_token;
  }

  async getAccounts(accessToken: string): Promise<Account[]> {
    const response: ApiResponse<Account> = await fetch(`${DATA_BASE_URL}/data/v1/accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());

    return response.results;
  }

  async getAccountBalance(accessToken: string, accountId: string): Promise<number> {
    const response: ApiResponse<Balance> = await fetch(
      `${DATA_BASE_URL}/data/v1/accounts/${accountId}/balance`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).then((res) => res.json());

    return response.results[0].current;
  }

  async getTotalBalance(accessToken: string): Promise<number> {
    const accounts = await this.getAccounts(accessToken);
    const balances = await Promise.all(
      accounts.map((account) => this.getAccountBalance(accessToken, account.account_id)),
    );
    return balances.reduce((acc, balance) => acc + balance, 0);
  }
}
