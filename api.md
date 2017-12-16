# API
## Enums

### SchoolType
numeric set by type

### SchoolLocation
string set by location

## Classes
### SchoolInfoParser

#### MenuParser
MenuParser Class

#### ScheduleParser
ScheduleParser Class

#### SchoolType
SchoolType enum set

#### SchoolLocation
SchoolLocation enum set

### SchoolParser
SchoolParser is base class of MenuParser and ScheduleParser

#### get SchoolCode
return SchoolCode string  

#### get SchoolLocation
return SchoolLocation string  

#### get SchoolType
return SchoolType string  


### MenuParser
MenuParser extends SchoolParser

#### constructor(schoolLocation,schoolCode,schoolType)
`schoolLocation` is SchoolLocation enum  
`schoolCode` is Schoolcode string  
`schoolType` is SchoolType enum  

#### async getDailyMenu(date,[recache])
`date` is Date Object  
`recache` is boolean  
**return DailyMenu Object of given date**  
if recache is true parser will override cached data  


#### async getMonthlyMenu(date,[recache])
`date` is Date Object  
`recache` is boolean  
**return MonthlyMenu Object of given date**  
if recache is true parser will override cached data  

#### async getAllergyInfo(date,[recache])
`date` is Date Object  
`recache` is boolean  
**return allergyInfo String of given date**  
if recache is true parser will override cached data  


### ScheduleParser
ScheduleParser extends SchoolParser

#### constructor(schoolLocation,schoolCode,schoolType)
`schoolLocation` is SchoolLocation enum  
`schoolCode` is Schoolcode string  
`schoolType` is SchoolType enum  

#### async getMonthlySchedule(date,[recache])
`date` is Date Object  
`recache` is boolean  
**return MonthlySchedule Object of given date**  
if recache is true parser will override cached data  

## Objects
### MonthlySchedule
#### schedules
schedules list  
##### [date]
**nullable**  
`date` can be any number  
it has schedule string array  

###MonthlyMenu
#### info
##### [date]
**nullable**  
`date` can be any number  
check DailyMenu Object for more information  

###DailyMenu
#### day
**nullable**  
date number

#### breakfast
**nullable**  
breakfast menu string  

#### lunch
**nullable**  
lunch menu string  

#### dinner
**nullable**  
dinner menu string  


# SchoolCode
[#use here](https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do) to search SchoolCode
