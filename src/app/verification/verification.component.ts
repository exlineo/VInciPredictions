import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../utils/services/auth.service';
import { LanguesService } from '../utils/services/langues.service';
import { CustomPattern } from '../utils/tools/CustomErrorMatch';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  // Connexion form
  verifForm = this.fbuild.group({
    mail: [this.auth.profil.u.email, [Validators.required, Validators.email]],
  });
  /**
   * Formulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
  constructor(public l:LanguesService, private fbuild:FormBuilder, private auth:AuthService) {}

  ngOnInit(): void {
    this.l.getPage('verification');
  }
  /** Resend verfiication email */
  resendVerificationEmail(){
    this.auth.verificationEmail();
  }
}
