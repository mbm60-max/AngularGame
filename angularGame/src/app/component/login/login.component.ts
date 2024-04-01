import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../service/supabase.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../service/loginservice.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!:FormGroup;
  constructor(private formBuilder:FormBuilder,private auth:SupabaseService,private router:Router,private loginService:LoginService){
    this.loginForm=this.formBuilder.group({
      email:formBuilder.control('',[Validators.required,Validators.email, Validators.minLength(5)]),
      password:formBuilder.control('',[Validators.required, Validators.minLength(7)]),
  })}
  public onSubmit(){
    this.auth.signIn(this.loginForm.value.email,this.loginForm.value.password).then((res: any)=>{
      console.log(res);
      if(res.data.user!.role == "authenticated"){
        const { name, id, email } = res.data.user;
      this.router.navigate(['/home']);
      this.loginService.setAuth({ name, id, email,inGame:false,isLoggedIn:true });
      console.log({ name, id, email,inGame:false,isLoggedIn:true });
      console.log("authenticated");
      }
    }).catch((err: any)=>{
      console.log(err);
    })
  } 
  //meed to add email confirm nots
}