/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement,track,wire,api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import {  getFieldValue,getRecord } from 'lightning/uiRecordApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import DAYS_PER_WEEK from '@salesforce/schema/Opportunity.days_per_week__c';
import HOURS_PER_DAY from '@salesforce/schema/Opportunity.hours_per_day__c';
import START_DATE from '@salesforce/schema/Opportunity.Start_Date__c';
import CONTRACT_LENGTH from '@salesforce/schema/Opportunity.Contract_Length__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CREATE_EXPENSES from '@salesforce/apex/opportunityScheduleCalculation.opportunitySchedule';
const fields = [CONTRACT_LENGTH, START_DATE,DAYS_PER_WEEK,HOURS_PER_DAY];
export default class Create_Schedule extends LightningElement 
{

        @track isOpenModal = false;
        @api recordId;
       // @track hoursOption;
        Create_Schedule()
        {
          var hoursValue;
          var daysValue;
          var startDateValue;
          var contractLengthValue;
          
        }
    @wire(getRecord, { recordId: '$recordId', fields })
    opportunity;
        @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
        objectInfo;
        @wire(getPicklistValues, {
           recordTypeId: '$objectInfo.data.defaultRecordTypeId',
           fieldApiName: DAYS_PER_WEEK
        })
        daysPicklistValues;
        @wire(getPicklistValues, {
          recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        // recordTypeId: '012000000000000AAA',
          // fieldApiName: TYPE_FIELD
          fieldApiName: HOURS_PER_DAY
       })
       hoursPicklistValues;
      
        
      
     /*  hoursPicklist()
       {
          var hoursOption=[];
          let i;
         for(i of daysPicklistValues.data.values)
         {
            hoursOption.push(i);
         }
       }
*/
       hoursSelected(event)
       {
        // var hours=Document.getElementById("hours").value;
        // var hoursValue;
          this.hoursValue =event.target.value;
        
        
       }  
       daysSelected(event)
       {
        
          this.daysValue=event.target.value;
        // console.log(daysValue);
       }
       get hours() {
        this.hoursValue=getFieldValue(this.opportunity.data, HOURS_PER_DAY);
        return getFieldValue(this.opportunity.data, HOURS_PER_DAY);
     }
     get days() {
      this.daysValue=getFieldValue(this.opportunity.data, DAYS_PER_WEEK);
      return getFieldValue(this.opportunity.data, DAYS_PER_WEEK);
   }

       get startDate() {
        this.startDateValue=getFieldValue(this.opportunity.data, START_DATE);
        return getFieldValue(this.opportunity.data, START_DATE);
     }

    get contractLength() {
      this.contractLengthValue=getFieldValue(this.opportunity.data, CONTRACT_LENGTH);
        return getFieldValue(this.opportunity.data, CONTRACT_LENGTH);
     }
     startDateUpdate(event)
     {
       this.startDateValue=event.target.value;
     }
     contractLengthUpdate(event)
     {
       this.contractLengthValue=event.target.value;
     }

    /* @wire(CREATE_EXPENSES, { recId : '$objectInfo.data.Id',oppObj :'$objectInfo' })
      expenses;
     */
     createExpense()
     {
      var updateOpp=[];
      
       //{ "days_per_week__c": daysValue, "hours_per_day__c": hoursValue, "id": recordId,"Contract_Length__c":contrartLengthValue,"Start_Date__c ":startDateValue}];
       let newOpp = {};
       console.log(newOpp);
     
     // this.hoursValue=this.hours();
     // this.daysValue=this.days()
      newOpp.Id=this.recordId;
       newOpp.days_per_week__c=this.daysValue;
       newOpp.hours_per_day__c=this.hoursValue;
       newOpp.Contract_Length__c=this.contractLengthValue;
       newOpp.Start_Date__c=this.startDateValue;
       console.log(newOpp);
       console.log(this.daysPicklistValues);
       updateOpp.push(newOpp);
       console.log(updateOpp);
      CREATE_EXPENSES({ oppList : updateOpp })
            .then(result => {
               
                const event = new ShowToastEvent({
                  title: 'Success!',
                  message: 'Schedule Created'
              });
              this.dispatchEvent(event);
              this.isOpenModal = false;
            })
            .catch(error => {
              
                console.log('failed');
                const event = new ShowToastEvent({
                  title: 'Error',
                  message: 'failed'
              });
              this.dispatchEvent(event);
              this.isOpenModal = false;
            });
           
     }





     
        
       
    
    handleOpenModal() {
        this.isOpenModal = true;   
       
    }
   
    handleCloseModal() {
        this.isOpenModal = false;
    }
}