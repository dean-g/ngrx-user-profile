import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILoadUserPayload, IUserProfileResults, UserProfile, UserProfileResponse } from '@interfaces';

// In order to keep the effects file optimized and well maintainable,
// we need to move the API call/business logic to the service layer  
@Injectable()
export class ProfileService {
    
    constructor (private http: HttpClient) {}

    // API call to get sinle random users 
    getUserProfile () : Observable<UserProfile> {

        return this.http.get<UserProfileResponse>('https://randomuser.me/api/').pipe(map((res) => {
              
            const userResults = res?.results[0];
            return <UserProfile>{
                cellNumber: userResults.cell,
                city: userResults.location.city,
                dateOfBirth: userResults.dob.date,
                email: userResults.email,
                firstName: userResults.name.first,
                id: userResults.login.uuid,
                lastName: userResults.name.last,
                phoneNumber: userResults.phone,
                picture: userResults.picture.medium
            };

        }));

    }

    // API call to get list of random users 
    getUserProfileList (userRequest: ILoadUserPayload) : Observable<UserProfile[]> {

        return this.http.get<UserProfileResponse>(`https://randomuser.me/api/?page=${userRequest.page + 1}&results=${userRequest.pageSize}&seed=abc`)
        .pipe(map((res) => this.getFormattedUserProfileList(res?.results)));

    }

    // Business logic to map the raw data with the user profile contracts 
    private getFormattedUserProfileList (userProfileList: IUserProfileResults[]):  UserProfile[] {

        if(!userProfileList?.length) {

            return [];

        }
        const formattedUserProfileList: UserProfile[] = [];
        for(let i = 0; i < userProfileList.length; i++) {

            formattedUserProfileList.push(<UserProfile>{
                cellNumber: userProfileList[i].cell,
                city: userProfileList[i].location.city,
                dateOfBirth: userProfileList[i].dob.date,
                email: userProfileList[i].email,
                firstName: userProfileList[i].name.first,
                id: userProfileList[i].login.uuid,
                lastName: userProfileList[i].name.last,
                phoneNumber: userProfileList[i].phone,
                picture: userProfileList[i].picture.medium
            });
            
        }
        return formattedUserProfileList;

    }

}
