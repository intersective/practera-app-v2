import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AssessmentService } from './assessment.service';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessment',
  templateUrl: 'assessment.component.html',
  styleUrls: ['assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
  
  // assessment id
  id = 0;
  // activity id
  activityId = 0;
  // context id
  contextId = 0;
  // action = 'assessment' is for user to do assessment
  // action = 'reivew' is for user to do review for this assessment
  action = '';
  // the structure of assessment
  assessment = {
    name: '',
    description: '',
    groups: [
      {
        name: '',
        questions: [
          {
            id: '',
            name: '',
            type: '',
            description: '',
            isRequired: false,
            canComment: true,
            canAnswer: true,
            choices: [
              {
                id: '',
                name: ''
              }
            ]
          }
        ]
      }
    ]
  };
  submission = {
    id: 0,
    status: '',
    answers: {}
  };
  review = {
    id: 0,
    answers: {}
  };
  doAssessment = false;
  doReview = false;
  feedbackReviewed = false;
  questionsForm = new FormGroup({});

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.action = this.route.snapshot.data.action;
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.activityId = parseInt(this.route.snapshot.paramMap.get('activityId'));
    this.contextId = parseInt(this.route.snapshot.paramMap.get('contextId'));

    // get assessment structure and populate the question form
    this.assessmentService.getAssessment(this.id)
      .subscribe(assessment => {
        this.assessment = assessment;
        this.populateQuestionsForm();
      });

    // get the submission answers &/| review answers
    this.assessmentService.getSubmission(this.id, this.contextId, this.action)
      .subscribe(result => {
        this.submission = result.submission;
        // this page is for doing assessment if submission is empty
        if (this.utils.isEmpty(this.submission)) {
          this.doAssessment = true;
          this.doReview = false;
          return ;
        }
        this.review = result.review;
        // this page is for doing review if the submission status is 'pending review' and action is review
        if (this.submission.status == 'pending review' && this.action == 'review') {
          this.doReview = true;
        }
        // call todo item to check if the feedback has been reviewed or not
        if (this.submission.status == 'published') {
          this.assessmentService.getFeedbackReviewed(this.review.id)
            .subscribe(result => {
              this.feedbackReviewed = result;
            });
        }
      });
  };

  // Populate the question form with FormControls. 
  // The name of form control is like 'q-2' (2 is an example of question id)
  populateQuestionsForm() {
    let questionsFormObject = {};
    let validator = [];
    this.assessment.groups.forEach(group => {
      group.questions.forEach(question => {
        // put 'required' validator in FormControl
        if (question.isRequired) {
          validator = [Validators.required];
        } else {
          validator = [];
        }
        questionsFormObject['q-' + question.id] = new FormControl('', validator);
      })
    });
    this.questionsForm = new FormGroup(questionsFormObject);
  }

  back() {
    this.router.navigate(['app', { outlets: { project: ['activity', this.activityId] } }]);
  }

  // form an object of required questions
  getRequiredQuestions() {
    let requiredQuestions = {};
    this.assessment.groups.forEach(group => {
      group.questions.forEach(question => {
        if (question.isRequired) {
          requiredQuestions[question.id] = true;
        }
      });
    });
    return requiredQuestions;
  }

  submit() {
    let answers = [];
    let assessment = {};
    let requiredQuestions = this.getRequiredQuestions();
    let questionId = 0;

    // form submission answers
    if (this.doAssessment) {
      assessment = {
        id: this.id,
        context_id: this.contextId
      }
      this.utils.each(this.questionsForm.value, (value, key) => {
        questionId = parseInt(key.replace('q-', ''));
        answers.push({
          assessment_question_id: questionId,
          answer: value
        });
        // unset the required questions object
        if (requiredQuestions[questionId] && value) {
          this.utils.unset(requiredQuestions, questionId);
        }
      });
      // check if all required questions have answer
      if (!this.utils.isEmpty(requiredQuestions)) {
        // display a pop up if required question not answered
        return this.utils.popUp('shortMessage', {message: 'Required question answer missing!'}, false);
      }
    }

    // form feedback answers
    if (this.doReview) {
      assessment = {
        id: this.id,
        review_id: this.review.id,
        submission_id: this.submission.id
      }
      this.utils.each(this.questionsForm.value, (value, key) => {
        if (value) {
          let answer = value;
          answer.assessment_question_id = parseInt(key.replace('q-', ''));
          answers.push(answer);
        }
      });
    }

    // save the submission/feedback
    this.assessmentService.saveAnswers(assessment, answers, this.action)
      .subscribe(result => {
        if (result.success) {
          let redirect = [];
          // redirect to activity page if it is doing assessment
          if (this.doAssessment) {
            redirect = ['app', { outlets: { project: ['activity', this.activityId] } }];
          }
          // redirect to reviews page if it is doing review
          if (this.doReview) {
            redirect = ['reviews'];
          }
          // display a pop up for successful submission
          return this.utils.popUp('shortMessage', {
            message: 'Submitted Successfully!'
          }, redirect);
        } else {
          // display a pop up if submission failed
          return this.utils.popUp('shortMessage', {
            message: 'Submission Failed, please try again later.'
          }, false);
        }
      });
  }

  reviewFeedback() {
    this.feedbackReviewed = true;
    this.assessmentService.saveFeedbackReviewed(this.review.id);
  }

}