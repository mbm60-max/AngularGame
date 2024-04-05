import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UnitCreditsService } from '../../service/unit-credits.service';

@Component({
  selector: 'app-credit-display',
  standalone: true,
  imports: [],
  templateUrl: './credit-display.component.html',
  styleUrl: './credit-display.component.scss'
})
export class CreditDisplayComponent implements OnInit,OnDestroy {
  credits:number=0;
 creditStateSubscription: Subscription | undefined;
 constructor(private creditService:UnitCreditsService){
 
 }
  ngOnInit(){
    this.creditStateSubscription = this.creditService.getCreditState().subscribe((creditState: number) => {
      this.credits = creditState;
    });
  }
  ngOnDestroy(): void {
    if (this.creditStateSubscription) {
      this.creditStateSubscription.unsubscribe();
    }
  }
}
