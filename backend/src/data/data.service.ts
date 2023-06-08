import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DuneQueryResponse } from './types';

@Injectable()
export class DataService {
  private duneApiKey: string;

  constructor(config: ConfigService) {
    this.duneApiKey = config.get('DUNE_API_KEY');
  }

  async getETHGlobalTxSenders() {
    const query = new URLSearchParams({
      api_key: this.duneApiKey,
    });
    const url = `https://api.dune.com/api/v1/query/2478110/results?${query.toString()}`;
    const response: DuneQueryResponse = await fetch(url).then((res) => res.json());
    return response.result.rows.map((row) => row.from);
  }
}
