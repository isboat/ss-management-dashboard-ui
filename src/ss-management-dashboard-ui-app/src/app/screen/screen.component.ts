import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenDetailsComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;

  data: ScreenModel = null;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();

      // In a real app: dispatch action to load the details here.
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData(){
    this.dataService.fetchScreenDetails(this.id).subscribe({
      next: (data) => this.data = data,
      error: (e) => {
        if(e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete') 
    });
 }

}
