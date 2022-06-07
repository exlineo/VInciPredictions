import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  constructor(public alert: MessageService) { }

  /**
   * Display success message
   * @param m Message to display
   * @param d Description to display
   */
   msgOk(m: string, d: string = '') {
    this.alert.add({ severity: 'success', summary: m, detail: d });
  }
  /**
   * Display fail message
   * @param m Message to display
   * @param d Description to display
   */
  msgFail(m: string, d: string = '') {
    this.alert.add({ id: 0, severity: 'error', summary: m, detail: d });
  }
  /**
   * Display warnin message
   * @param m Message to display
   * @param d Description to display
   */
  msgGaffe(m: string, d: string = '') {
    this.alert.add({ severity: 'warn', summary: m, detail: d });
  }
  /**
   * Display information message
   * @param m Message to display
   * @param d Description to display
   */
  msgInfo(m: string, d: string = '') {
    this.alert.add({ severity: 'info', summary: m, detail: d });
  }
  /**
   * Clear all messages
   */
  msgNo() {
    this.alert.clear();
  }
}
