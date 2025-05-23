// multi lingual support for the app
export const englishContent = {
  language: "eng",
  app_name: "Start",
  app_desc: `Empowering non-specialist health workers in low-resource settings
            with START (Screening Tools for Autism Risk using Technology): A mobile, open-source platform for early autism risk
            detection and comprehensive neurodevelopmental assessment`,
  buttons: {
    allow: "Allow",
    cancel: "Cancel",
    login: "Sign in",
    open_settings: "Open settings",
    viewGithub: "View on Github",
    startSurvey: "start the survey",
    about: "about us",
    content: "View Data",
  },

  hints: {
    username: "Username",
    password: "Password",
  },

  permissions: {
    error_title: "Permissions",
    error_message:
      "Please allow all permissions. Without them, the application can't work.",
    denied_error_message:
      "Application can't work without allowed permissions. Please open the settings and allow all required permissions.",
  },

  screen_titles: {
    my_surveys: "My surveys",
    add_child: "Add new child",
    add_first_parent: "Add first parent",
    add_second_parent: "Add second parent",
    edit_child: "Edit child's info",
    edit_first_parent: "Edit first parent's info",
    edit_second_parent: "Edit second parent's info",
    child_information: "Child's profile",
    survey: "Survey %s",
    child_diagnosis: "Pre-existing diagnostic info",
    menu: "Menu",
    about_project: "About START",
    user_guide: "User guide",
  },

  menu: {
    user_guide: "User guide",
    about_project: "About the project",
    settings: "Settings",
    log_out: "Log out",
    language_options: {
      english: "En",
      hindi: "Hn",
    },
  },

  static_texts: {
    male: "Male",
    female: "Female",
    parent: "Parent",
    guardian: "Guardian",
  },

  success_messages: {
    password_valid: "Password is valid",
    password_changed: "Password has been changed.",
  },

  error_messages: {
    login_failed_title: "Authentication failed",
    login_failed:
      "The username and/or password are incorrect. Please check them and try again.",
    login_internet_connection_failed:
      "Authentication has failed. Please check your internet connection.",
    login_attempt_failed: "You can attempt the next login after 30 minutes.",
    user_validation: "Enter a valid username",
    password_validation:
      "Enter a value between 4 and 10 alphanumeric characters",
    forgot_password_validation: "Please, enter the same passwords.",
    forgot_date: "Please, enter a correct username and date of birth.",
    reset_password:
      "The username and/or date of birth are incorrect. Please check them and try again.",
    login_attempts_end:
      "The account was suspended. Please, contact your supervisor to unblock the account.",
    general_error: "Error",
    upload_general:
      "Unable to upload survey. Please check your internet connection",
    upload_internet_connection:
      "Uploading is failed. Please check your internet connection",
    upload_add_child:
      "Unable to upload child info. Please check your internet connection",
    upload_add_survey:
      "Unable to upload survey info. Please check your internet connection",
    upload_test:
      "Unable to upload test %s. Please check your internet connection",
  },

  consent: {
    dialog_header: "Participant information sheet",
    sign_dialog_header: "Parent/Guardian signature",
    success_header: "Successful registration",
    success_message:
      "The registration was completed successfully. Do you want to visit My surveys page or start the survey?",
    information_sheet: {
      paragraph_1: "I, agree for my child to participate in the study...",
      paragraph_2:
        "Supervisor: Dr Bhismadev Chakrabarti\nEmail: b.chakrabarti@reading.ac.uk...",
    },
    success_options: {
      my_surveys: "My surveys",
      start_survey: "Start survey",
    },
    agree_text: "The procedures have been explained clearly to us...",
  },

  login: {
    password_reset_title: "Restore the password",
    password_reset_message: "Please, enter your username and date of birth",
    password_set_message: "Please, enter new password",
    password_reset_new_password: "New password",
    password_reset_confirm_password: "Confirm password",
    password_reset_username: "Username",
    password_reset_date: "MM / DD / YYYY",
    forgot_password: "Forgot password?",
  },

  logout: {
    dialog_title: "Log out",
    dialog_message: "Do you really want to exit?",
  },

  child: {
    name: "Child's name",
    surname: "Child's surname",
    date_of_birth: "Tap to set the date of birth",
    address: "Child's address",
    dialog_edit_close_title: "Edit child's info",
    dialog_add_close_title: "Add new child",
    dialog_edit_close_message: "Do you really want to exit without saving?",
    info_pattern: "Born on %1$s",
    state_hint: "Tap to select the state",
    hand_dominance: {
      hint: "Hand dominance",
      right: "Right",
      left: "Left",
      ambidextrous: "Ambidextrous",
    },
  },

  parent: {
    skip_step_text: "Skip this step",
    name: "Parent's name",
    surname: "Parent's surname",
    date_of_birth: "Tap to set the date of birth",
    address: "Parent's address",
    phone: "Phone number",
    email_address: "Email address",
    language: "Tap to select the language",
    preferable_contact_hint: "Preferable method of contact",
    preferable_contact_options: {
      not_specified: "Not specified",
      post: "Post",
      phone: "Phone",
      email: "Email",
    },
  },

  survey: {
    name: "Survey %s",
    dialog_delete_title: "Delete the survey",
    dialog_delete_message:
      "Are you sure you want to delete the survey? All data will be lost.",
    dialog_download_title: "Download the survey",
    dialog_download_message: "Are you sure you want to download this survey?",
  },

  diagnosis: {
    clinic_doctor_name: "Clinic / Doctor name",
    describe_diagnosis: "Describe diagnosis",
    assessment_date: "Tap to set the diagnosis date",
  },

  validation: {
    incorrect_name: "Incorrect name",
    incorrect_surname: "Incorrect surname",
    incorrect_address: "Incorrect address",
    incorrect_phone_number: "Incorrect phone number",
    incorrect_email: "Incorrect email",
  },

  progress_dialog: {
    upload_survey: "Survey is being uploaded. Please wait.",
  },

  about: {
    text: "The START project is the result of a collaboration between...",
    header: "Project Participants",
    participants: [
      {
        name: "Medical Research Council",
        description: "It is a publicly funded government agency...",
      },
      {
        name: "University of Reading",
        description: "The University (located in Berkshire, England)...",
      },
    ],
  },
  banner: {
    shortText: "Simple and easy",
    title: "Made for childs brain testing!!",
    desc: "The project aims to provide comprehensive insights into various aspects of a child's cognitive and emotional development by leveraging advanced data analysis techniques.",
    quesText: "Are You Ready?",
  },
};

export const hindiContent = {
  language: "हिंदी",
  app_name: "स्टार्ट",
  app_desc: `कम संसाधन वाले क्षेत्रों में गैर-विशेषज्ञ स्वास्थ्यकर्मियों को सक्षम बनाना START (स्क्रीनिंग टूल्स फॉर ऑटिज़्म रिस्क यूज़िंग टेक्नोलॉजी) के साथ: प्रारंभिक ऑटिज़्म जोखिम पहचान और व्यापक न्यूरोडेवलपमेंटल मूल्यांकन के लिए एक मोबाइल, ओपन-सोर्स प्लेटफ़ॉर्म।`,
  buttons: {
    allow: "आगे बढ़ें",
    cancel: "रद्द करें",
    login: "साइन इन करें",
    open_settings: "सेटिंग्स खोलें",
    viewGithub: "गिटहब पर देखें",
    startSurvey: "सर्वे शुरू करें",
    about: "हमारे बारे में",
    content: "डेटा देखें",
  },
  hints: {
    username: "यूजर नेम",
    password: "पासवर्ड",
  },
  permissions: {
    error_title: "अनुमतियां",
    error_message:
      "कृपया सभी अनुमतियों को पास करें उनके बिना ऐप काम नहीं कर सकताा",
    denied_error_message:
      "ऐप आपकी अनुमति के बिना काम नहीं कर सकता। कृपया सेटिंग खोलें और सभी आवश्यक अनुमतियों को पास करें।",
  },
  screen_titles: {
    my_surveys: "मेरे सर्वे",
    add_child: "नए बच्चे का प्रोफाइल जोड़ें",
    add_first_parent: "पहले अभिभावक/माता/पिता का प्रोफाइल जोड़ें",
    add_second_parent: "दूसरे अभिभावक/माता/पिता का प्रोफाइल जोड़ें",
    edit_child: "बच्चे की जानकारी में बदलाव करें |",
    edit_first_parent: "पहले अभिभावक/माता/पिता की जानकारी में बदलाव करें |",
    edit_second_parent: "दूसरे अभिभावक/माता/पिता की जानकारी में बदलाव करें |",
    child_information: "बच्चे का प्रोफाइल",
    survey: "सर्वे %s",
    child_diagnosis: "पहले से मौजूद किसी तकलीफ/बीमारी की जानकारी",
    menu: "मेनू",
    menu_about_project: "प्रोजेक्ट की जानकारी",
    menu_user_guide: "उपयोगकर्ता के लिए जानकारी",
  },
  menu: {
    user_guide: "उपयोगकर्ता के लिए जानकारी",
    about_project: "प्रोजेक्ट की जानकारी",
    settings: "सेटिंग्स",
    log_out: "लॉग आउट",
    english: "En",
    hindi: "हिंदी",
  },
  static_text: {
    male: "पुरुष",
    female: "स्त्री",
    parent: "माता-पिता",
    guardian: "अभिभावक",
  },
  success_messages: {
    password_valid: "पासवर्ड मान्य है",
    password_changed: "पासवर्ड बदल दिया गया है।",
  },
  error_messages: {
    login_failed_title: "लॉग-इन सफल नहीं हो सका",
    login_failed:
      "यूजर नेम (उपयोगकर्ता नाम) और / या पासवर्ड गलत है। कृपया उन्हें  ठीक करें और दुबारा कोशिश करें।",
    login_internet_failed:
      "लॉग-इन सफल नहीं हो सका | कृपया अपने इंटरनेट कनेक्शन की जाँच करें।",
    login_attempt_failed: "आप अगले लॉगिन का प्रयास 30 मिनट के बाद कर सकते हैं।",
    user_validation: "मान्य उपयोगकर्ता नाम दर्ज करें",
    password_validation: "4 से 10 अक्षर एंव नंबर का एक पासवर्ड डालें",
    forgot_password_validation: "कृपया उसी पासवर्ड को दुबारा डालें",
    forgot_date: "कृपया, सही उपयोगकर्ता नाम और जन्म तिथि दर्ज करें।",
    reset_password:
      "आपका पासवर्ड दर्ज नहीं हो सका कृपया अपना इंटरनेट कनेक्शन जाँचे या अपने सुपरवाइजर से सम्पर्क करें।",
    login_attempts_end:
      "यह खाता बंद कर दिया गया है। कृपया, खाता फिर से शुरू करने के लिए अपने सुपरवाइजर से संपर्क करें।",
    error: "गलती",
    upload_general:
      "सर्वेक्षण अपलोड करने में असमर्थ कृपया अपने इंटरनेट कनेक्शन की जाँच करें",
    upload_internet_connection:
      "सर्वे अपलोड नहीं हो पा रहा| कृपया अपने इंटरनेट कनेक्शन की जाँच करें",
  },
  consent: {
    dialog: {
      header_text: "सहमति पत्र (कंसेंट फॉर्म)",
      sign_dialog_header_text: "माता - पिता / अभिभावक के हस्ताक्षर",
      success_header_text: "प्रोफाइल सफलता से बन गया है",
      success_message_text:
        "प्रोफाइल सफलता से बन गया है क्या आप मेरे सर्वे पृष्ठ पर जाकर टेस्ट शुरू करना चाहते हैं?",
      paragraph_title_2: "प्रोजेक्ट की जानकारी",
      paragraph_message_1:
        "हम रेडिंग विश्वविद्यालय के प्रोफेसर भीष्मदेव चक्रवर्ती और डॉ इंदु दुबे द्वारा...",
      paragraph_message_2: "प्रधान रिसर्चर: प्रोफेसर भीष्मदेव चक्रवर्ती ...",
      success_surveys: "मेरे सर्वे",
      success_start: "सर्वे शुरू करें",
      agree: "हम इस प्रोजेक्ट में भाग लेने के लिए सहमत हैं",
    },
  },
  login: {
    password_reset_title: "नया पासवर्ड बनायें",
    password_reset_message: "कृपया अपना यूजर नेम और जन्म की तारिख डालें",
    password_set_message: "कृपया नया पासवर्ड डालें",
    password_reset_new_password: "नया पासवर्ड",
    password_reset_confirm_password: "पासवर्ड की पहचान करें",
    password_reset_username: "यूजर नेम",
    password_reset_date: "दिन / माह / वर्ष",
    forgot_password: "पासवर्ड भूल गए?",
  },
  synchronize_dialog: {
    error_title: "सर्वर के साथ कनेक्शन नहीं हो पा रहा",
    error_message:
      "सर्वर के साथ कनेक्शन नहीं हो पा रहा | कृपया अपने इंटरनेट कनेक्शन की जाँच करें और दुबारा कोशिश करें",
  },
  logout: {
    dialog_title: "लॉग -आउट",
    dialog_message: "क्या आप वास्तव में ऐप से बहार निकलना चाहते हैं",
  },
  child: {
    name: "बच्चे का नाम",
    surname: "बच्चे का पारिवारिक नाम",
    date_of_birth: "बच्चे के जन्म के तारीख़",
    address: "बच्चे का पता",
    dialog_edit_close_title: "बच्चे की जानकारी में बदलाव करें",
    dialog_add_close_title: "नए बच्चे का प्रोफाइल जोड़ें",
    dialog_edit_close_message:
      "क्या आप वाकई जानकारी को सुरक्षित किये बिना बाहर निकलना चाहते हैं?",
    info_pattern: "जन्म तारीख़ %1$s",
    state_hint: "राज्य चुनने के लिए टैप करें",
    hand_hint: "किस हाथ का प्रयोग करता है",
    hand_right: "दायाँ",
    hand_left: "बायां",
    hand_ambidexter: "दोनों हाथों का इस्तेमाल करने वाला",
  },
  validation: {
    incorrect_name: "गलत नाम",
    incorrect_surname: "गलत पारिवारिक नाम",
    incorrect_address: "गलत पता",
    incorrect_phone_number: "गलत फोन नंबर",
    incorrect_email: "गलत ईमेल",
  },
  progress_dialog: {
    upload_survey: "सर्वे अपलोड हो रहा है, कृपया प्रतीक्षा करें",
  },
  about: {
    about_text:
      "स्टार्ट प्रोजेक्ट रेडिंग विश्वविद्यालय, पब्लिक हेल्थ फाउंडेशन ऑफ़ इंडिया, बर्कबेक विश्वविद्यालय, नाटिंहम ट्रेन्ट विश्वविद्यालय, आल इंडिया इंस्टिट्यूट ऑफ़ मेडिकल साइंसेस, संगत , इंडियन इंस्टिट्यूट ऑफ़ टेक्नोलॉजी (मुंबई), तथा थेरेपी बॉक्स® संगठनों के बीच एक सहयोग का परिणाम है। इस परियोजना को मेडिकल रिसर्च काउंसिल ब्रिटेन द्वारा ग्लोबल चैलेंज रिसर्च फंड फाउंडेशन अवॉर्ड की तरफ से धन-राशि दी गयी है।\n\nस्टार्ट एक ऐसा मोबाइल प्लेटफॉर्म है जिसका उपयोग माता-पिता की जानकारी और प्रत्यक्ष बाल मूल्यांकन को एकत्रित करने के लिए किया जाएगा। उम्मीद है की इस प्लेटफार्म के ज़रिये ऑटिज़्म के संभावित २-५ साल के बच्चों का पता लगने में आसानी होगी।\n\nसाधारणतय ऑटिज़्म ग्रसित बच्चे एक चीज से ध्यान हटा कर दूसरी चीज पर ध्यान लगाने में धीमे होते हैं| वह लोगों से ज्यादा वस्तुओं पर ध्यान देते हैं। यह जांच इसी ज्ञान पर आधारित है, व इसमें ऑटिज़्म के विभिन्न सामाजिक एंवम संवेदना सम्बंधित लक्षणों को जांचने के टेस्ट/ खेल डाले गए हैं। आई-ट्रैकिंग एक ऐसी तकनीक है जो कि ऑटिज़्म का पता लगाने में काफी मदद कर सकती है। उस तकनीक का प्रयोग इस जाँच में बच्चे का ध्यान नापने में किया जाएगा, जबकि व्यवहार प्रतिक्रियाएं टचस्क्रीन के माध्यम से दर्ज की जाएंगी।",
    about_header: "परियोजना प्रतिभागी",
    participants: [
      {
        header: "मेडिकल रिसर्च काउन्सिल",
        message:
          "यह एक सार्वजनिक तथा सरकारी वित्तिय संस्था है जो यूनाइटेड किंगडम में चिकित्सा अनुसंधान के समन्वय और वित्तपोषण के लिए जिम्मेदार है। इस संस्था ने ग्लोबल चैलेंज रिसर्च फंड फाउंडेशन अवार्ड के अंतर्गत स्टॉर्ट परियोजना को वित्त पोषित किया है।",
      },
      {
        header: "रेडिंग विश्वविद्यालय",
        message:
          "यह विश्वविद्यालय (बर्कशायर, इंग्लैंड में स्थित) 1892 में एक सार्वजनिक विश्वविद्यालय के रूप में स्थापित किया गया है। स्टार्ट परियोजना इस विश्विद्यालय के मनोविज्ञान के प्रोफेसर भीष्मादेव चक्रवर्ती के नेतृतव में चलायी जा रही है।",
      },
      {
        header: "पब्लिक हेल्थ फाउंडेशन ऑफ़ इंडिया",
        message:
          "पीएचएफआई सार्वजनिक स्वास्थ्य के क्षेत्र में शिक्षा, प्रशिक्षण, अनुसंधान और नीति विकास को मजबूत करने के लिए भारत में संस्थागत और सिस्टम क्षमता का निर्माण करने में मदद कर रहा है।\nपरियोजना सहयोगी: <b> प्रोफेसर विक्रम पटेल </b>",
      },
      {
        header: "बर्कबेक विश्वविद्यालय",
        message:
          "बर्कबेक विश्वविद्यालय एक सार्वजनिक अनुसंधान विश्वविद्यालय है, जो कि लंदन, इंग्लैंड के ब्लूमस्बरी में स्थित है इसे 1823 में स्थापित किया गया था।\nपरियोजना सहयोगी: <b> मार्क जॉनसन </b> और <b> टियोडोरा ग्लिगा</b>",
      },
      {
        header: "नॉटिंहम ट्रेंट विश्वविद्यालय",
        message:
          "उच्च शिक्षा के कई अलग-अलग संस्थानों के एकीकरण के द्वारा इस विश्वविद्यालय का गठन किया गया था। यह विश्वविद्यालय 1843 में स्थापित नॉटिंघम गवर्नमेंट स्कूल ऑफ डिजाइन से उत्पन्न हुआ।\nपरियोजना सहयोगी: <b> मैथ्यू बेलमोन </b>",
      },
      {
        header: "ऑल इंडिया इंस्टिट्यूट ऑफ मेडिकल साइंसेस",
        message:
          "ऑल इंडिया इंस्टीट्यूट ऑफ मेडिकल साइंसेज (एम्स) उच्च शिक्षा के स्वायत्त सार्वजनिक चिकित्सा महाविद्यालयों का एक समूह है। एम्स नई दिल्ली, 1 9 56 में स्थापित किया गया था।\nपरियोजना सहयोगी: <b> डॉ शेफाली गुलाटी</b>",
      },
      {
        header: "संगत",
        message:
          "संगत एक गैर-सरकारी, गैर-लाभकारी संगठन है जो उचित शारीरिक, मनोवैज्ञानिक और सामाजिक चिकित्सा प्रदान करने के लिए मौजूदा सामुदायिक संसाधनों को सशक्त करने पर काम कर रहा है।\nपरियोजना सहयोगी: <b> गौरी दिवाण</b>",
      },
      {
        header: "इंडियन इंस्टिट्यूट ऑफ़ टेक्नोलॉजी मुंबई",
        message:
          "आईआईटी, मुंबई, भारत में स्थित एक सार्वजनिक इंजीनियरिंग संस्थान है। यह इंडियन इंस्टिट्यूट ऑफ टेक्नोलॉजी सिस्टम में दूसरा सबसे पुराना इंस्टिट्यूट है।\nपरियोजना सहयोगी: <b> प्रोफेसर शरत चंद्रन</b>",
      },
      {
        header: "थेरेपी बॉक्स",
        message:
          "थेरेपी बॉक्स एक बहु-पुरस्कार विजेता सॉफ्टवेयर विकास कंपनी है, जिसमें स्वास्थ्य देखभाल और शिक्षा नवप्रवर्तन में विशेषज्ञता वाला ट्रैक रिकॉर्ड है। हमें नवाचार के लिए कई अंतरराष्ट्रीय पुरस्कार प्राप्त हुए हैं और हम जटिल और विशेष विकास परियोजनाओं पर विश्वविद्यालयों के साथ काम करने में इस विशेषज्ञता को लाते हैं।\nपरियोजना प्रतिभागियों: <b> स्वप्निल गाडगील, रेबेका ब्राइट, नादिर इब्राहिमोव </b>",
      },
    ],
  },
  user_guide: {
    login: {
      header: "लॉगिन करें और पासवर्ड को पुनर्स्थापित करें",
      message:
        'ऐप शुरू करने के लिए, अपना यूजर नेम (उपयोगकर्ता नाम) और पासवर्ड डालें और "साइन इन" बटन दबाएं। ...',
    },
    registration: {
      header: "बच्चे और माता/पिता का रजिस्ट्रेशन (पंजीकरण)",
      message:
        'नए बच्चे को रजिस्टर करने के लिए, मेरे सर्वे पेज पर "जोड़ें" का बटन दबाएं। पहले पेज में, आप बच्चे की जानकारी डालेंगे ...',
    },
    test_instructions: {
      header: "टेस्ट के सामान्य निर्देश",
      message:
        "टेस्ट शुरू करने के लिए, आपको टैबलट को एक समतल और स्थिर सतह पर रखें। कृपया सुनिश्चित करें कि कमरे में रौशनी ठीक से है ...",
    },
    survey_upload: {
      header: "सर्वे अपलोड",
      message:
        "सर्वे पूरा होने के बाद, और यदि ऐप में इंटरनेट कनेक्शन है, तो आप सर्वे पेज पर अपलोड बटन दबाकर सर्वे अपलोड कर सकते हैं। ...",
    },
    language: {
      header: "भाषा बदलें",
      message:
        'भाषा बदलने के लिए, मुख्य पेज के ऊपरी दाईं ओर बने "मेनू" आइकन को दबाएं। नए पेज पर आपको भाषा चुनने ...',
    },
  },
  banner: {
    shortText: "सरल और आसान",
    title: "बच्चों के मस्तिष्क परीक्षण के लिए बनाया गया!!",
    desc: "यह परियोजना उन्नत डेटा विश्लेषण तकनीकों का उपयोग करके बच्चे के संज्ञानात्मक और भावनात्मक विकास के विभिन्न पहलुओं पर व्यापक जानकारी प्रदान करने का लक्ष्य रखती है।",
    quesText: "क्या आप तैयार हैं?",
  },
};
