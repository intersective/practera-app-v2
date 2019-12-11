import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { OverviewRoutingComponent } from './overview-routing.component';
import { HomeComponent } from './home/home.component';
import { HomeService } from './home/home.service';
import { TodoCardComponent } from './home/todo-card/todo-card.component';
import { SlidableComponent } from './home/slidable/slidable.component';
import { ProjectComponent } from './project/project.component';
import { FastFeedbackModule } from '../fast-feedback/fast-feedback.module';
import { ProjectService } from './project/project.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: OverviewRoutingComponent,
        children: [
          {
            path: '',
            component: HomeComponent,
            outlet: 'home',
          },
          {
            path: '',
            component: ProjectComponent,
            outlet: 'project',
          },
        ]
      },
    ]),

    FastFeedbackModule,
  ],
  declarations: [
    HomeComponent,
    // HomeRoutingComponent,
    TodoCardComponent,
    SlidableComponent,
    OverviewRoutingComponent,
    ProjectComponent,
  ],
  providers: [
    ProjectService,
    HomeService,
  ],
  exports: [
    RouterModule,
    SharedModule,
    FastFeedbackModule,
  ],
})
export class OverviewModule { }