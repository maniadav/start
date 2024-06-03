import { LOCALSTORAGE } from "constants/storage.constant";
import PsychAPI from "./PsychAPI";
import { getLocalStorageValue } from "utils/localStorage";
import { API_ENDPOINT } from "@constants/api.constant";


class UtilityAPI extends PsychAPI {

    // auth
    public userRegister = (body: any) => {
        let headers = {
            "apikey": process.env.NUCLEUS_APIKEY,
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryqwvzmIgWW9pMEq6p"
        };
        return this.PsychAPI.post(
            `${API_ENDPOINT.auth.register}`,
            body,
            { headers }
        );
    };
    public userLogin = (data: any) => {
        return this.PsychAPI.post(`${API_ENDPOINT.auth.login}`, { ...data })
    };


    public generateOTP = (username: string) => {
        return this.PsychAPI.get(`/api/generateOTP`, { params: { username } })
    };
    public verifyOTP = (data: any) => {
        return this.PsychAPI.get('/api/verifyOTP', { ...data })
    };
    // email above generated otp 
    public senMailWithOTP = (data: any) => {
        return this.PsychAPI.post('/api/registerMail', { ...data })
    };
    // reset password (it should take MFAtoken, oldPassword, newPassword, username)
    public resetPassword = (data: any) => {
        return this.PsychAPI.get('/api/resetPassword', {
            ...data
        })
    };


    public uploadImage = (body: FormData) => {
        let headers = {
            "apikey": process.env.NUCLEUS_APIKEY,
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryqwvzmIgWW9pMEq6p"
        };
        return this.PsychAPI.post(
            '/image-upload-ms/services/upload?upload_flag=true&flag=1&sizes=50x50,200x200,400x400,800x800,1200x1200',
            body,
            { headers }
        );
    };
    public getOPlist = (params: { selectedDate: string }) => {
        return this.PsychAPI.post('/api/getPatientData1', params);
    };
    public getOPEMR = (appointmentID: string) => {
        const url = `/api/fetchInformation1${appointmentID && `?ID=${appointmentID}`}`;
        return this.PsychAPI.get(url);
    };
    public getPatientInfo = (uniqueID: string) => {
        const url = `api/patientInfo${uniqueID && `?uniqueID=${uniqueID}`}`;
        return this.PsychAPI.get(url);
    };
    public getPatientPrevReport = (uniqueID: string) => {
        const url = `api/PreviousReports${uniqueID && `/${uniqueID}`}`;
        return this.PsychAPI.get(url);
    };
    public updateOPEMR = (data: any) => {
        return this.PsychAPI.post('/api/postData', { ...data })
    };
    public finalizeOPEMR = (data: any) => {
        return this.PsychAPI.post('/api/finaliseReport', { ...data })
    };
    public submitReportOPEMR = (data: any) => {
        return this.PsychAPI.post('/api/outpatientReportFile', { ...data })
    };
    public submitReportOPEMR2 = (body: FormData) => {
        console.error(body)
        let headers = {
            "apikey": process.env.NUCLEUS_APIKEY,
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryqwvzmIgWW9pMEq6p"
        };
        return this.PsychAPI.post(
            '/api/outpatientReportFile',
            body,
            { headers }
        );
    };
    public getPatientCompaint = (personId: any) => {
        return this.PsychAPI.get(
            `/complaints/${personId}`,
        );
    };
    public verifyUsername = (username: string) => {
        return this.PsychAPI.post('/api/authenticate', { username })
    };
    public getUserProfile = (personUsername: any) => {
        return this.PsychAPI.get(
            `/api/user/${personUsername}`,
        );
    };
    public getUser = (username: string) => {
        return this.PsychAPI.get(
            `/api/user/${username}`,
        );
    }
    // follow up
    public followUpCreate = (data: any) => {
        return this.PsychAPI.post('/api/followAppointments', { ...data })
    };
    public fetchInformationforFollowUp = (id: string) => {
        return this.PsychAPI.get(`api/fetchInformationforFollowUp?ID=${id}`)
    };
    public followUpPostDraft = (data: any) => {
        return this.PsychAPI.post('/api/postDataForFollowUp', { ...data })
    };
    public followUpPostFinal = (data: any) => {
        return this.PsychAPI.post('/api/postDataFinaliseForFollowUp', { ...data })
    };
    public getFollowUpAppointment = (uniqueID: string) => {
        return this.PsychAPI.get(`/api/getFollowUpAppointment/${uniqueID}`)
    };
    public getFollowUpList = (params: { selectedDate: string }) => {
        return this.PsychAPI.post('/api/getFollowUpPatient', params);
    };
    // tele-medicine
    public getTelemedicinePatient = (params: { selectedDate: string }) => {
        return this.PsychAPI.post('/api/getTelemedicinePatient', params);
    };
    // in-patient
    public inPatientCreate = (data: any) => {
        return this.PsychAPI.post('/api/createInPatient', { ...data });
    };
    public getIPlist = (params: { admittingDate: string }) => {
        return this.PsychAPI.post('/api/getInPatient', params);
    };
    public getIPEMR = (appointmentID: string) => {
        const url = `/api/getInPatient2/${appointmentID && `${appointmentID}`}`;
        return this.PsychAPI.post(url);
    };
    public postIPEMR = (params: any) => {
        return this.PsychAPI.post('/api/postDataForInpatientRecord', params);
    };

    // user 
    public updateUserData = (data: any) => {
        const token = getLocalStorageValue(LOCALSTORAGE.MFA_ACCESS_TOKEN);
        let headers = {
            "apikey": process.env.NUCLEUS_APIKEY,
            Authorization: `Bearer ${token}`
        };
        return this.PsychAPI.post('/api/postData', { ...data }, { headers })
    };
}



export default UtilityAPI