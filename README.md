# shingo-website
Node Server for Public Facing Website to distribute public content

## Response for
```sql
  SELECT Id, Name, Course__c, Event_Start_Date__c, Event_End_Date__c, Host_Organization__c, Host_City__c, Host_Country__c, Event_Website__c FROM Event__c WHERE Visibility__c='Public' AND Event_Type__c='Affiliate Event' AND Verified__c=true AND Course__c!=null AND Event_End_Date__c>=YESTERDAY ORDER BY Event_Start_Date__c
```
```json
{
  "Discover": [
    {
      "attributes": {
        "type": "Event__c",
        "url": "/services/data/v36.0/sobjects/Event__c/a0R1200000Uls6mEAB"
      },
      "Id": "a0R1200000Uls6mEAB",
      "Name": "2016/06/01 Discover Lensys",
      "Course__c": "Discover",
      "Event_Start_Date__c": "2016-06-01",
      "Event_End_Date__c": "2016-06-02",
      "Host_Organization__c": "Laboratorios Clinic",
      "Host_City__c": "Querétaro",
      "Host_Country__c": "Mexico",
      "Event_Website__c": "https://www.lensys.mx/calendario/discover-excellence-4/"
    }, ...
  ],
  "Enable": [
    {
      "attributes": {
        "type": "Event__c",
        "url": "/services/data/v36.0/sobjects/Event__c/a0R1200000UmO5HEAV"
      },
      "Id": "a0R1200000UmO5HEAV",
      "Name": "2016/9/15 Enable GBMP",
      "Course__c": "Enable",
      "Event_Start_Date__c": "2016-09-15",
      "Event_End_Date__c": "2016-09-16",
      "Host_Organization__c": "Biamp Systems",
      "Host_City__c": "Tigard. OR",
      "Host_Country__c": "United States of America",
      "Event_Website__c": "https://www.gbmp.org/our-events.html"
    }, ...
  ],
  "Improve": [
    {
      "attributes": {
        "type": "Event__c",
        "url": "/services/data/v36.0/sobjects/Event__c/a0R1200000UnfvoEAB"
      },
      "Id": "a0R1200000UnfvoEAB",
      "Name": "2016/05/18 Improve GBMP",
      "Course__c": "Improve",
      "Event_Start_Date__c": "2016-05-18",
      "Event_End_Date__c": "2016-05-19",
      "Host_Organization__c": "Accurounds",
      "Host_City__c": "Avon, MA",
      "Host_Country__c": "United States of America",
      "Event_Website__c": "https://www.gbmp.org/gbmp-list-of-events/icalrepeat.detail/2016/05/18/99/66/shingo-institute-course-continuous-improvement-northeast"
    }, ...
  ],
  "Align": [
    {
      "attributes": {
        "type": "Event__c",
        "url": "/services/data/v36.0/sobjects/Event__c/a0R1200000UnfwSEAR"
      },
      "Id": "a0R1200000UnfwSEAR",
      "Name": "2016/06/15 Align GBMP",
      "Course__c": "Align",
      "Event_Start_Date__c": "2016-06-15",
      "Event_End_Date__c": "2016-06-16",
      "Host_Organization__c": "Accurounds",
      "Host_City__c": "Avon, MA",
      "Host_Country__c": "United States of America",
      "Event_Website__c": "https://www.gbmp.org/gbmp-list-of-events/icalrepeat.detail/2016/06/15/100/66/shingo-institute-course-enterprise-alignment-northeast"
    }, ...
  ]
}
```
