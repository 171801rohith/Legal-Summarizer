export const legalTemplates = {
  bailApplication: `IN THE COURT OF SESSIONS JUDGE, [CITY]

BAIL APPLICATION NO. [NUMBER] OF [YEAR]

[APPLICANT NAME]
... Applicant
Vs.
STATE OF [STATE]
... Respondent

APPLICATION FOR GRANT OF BAIL UNDER SECTION 439 CrPC

The Applicant above named respectfully submits:

1. That the Applicant has been arrested on [DATE] in connection with FIR No. [NUMBER] registered at Police Station [NAME] for alleged offences under Sections [SECTIONS] of IPC.

2. That the Applicant is innocent and has been falsely implicated in this case.

3. That the investigation is complete and the Applicant is no longer required for custodial interrogation.

4. That the Applicant is a permanent resident of [ADDRESS] and has deep roots in society.

5. That the Applicant undertakes to abide by all conditions imposed by this Hon'ble Court.

PRAYER

In view of the facts stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

a) Release the Applicant on bail in connection with FIR No. [NUMBER];

b) Pass such other and further orders as may be deemed fit and proper in the facts and circumstances of the case.

[APPLICANT NAME]
[ADDRESS]
[CONTACT INFORMATION]`,

  divorcePetition: `IN THE COURT OF DISTRICT JUDGE, [CITY]

MATRIMONIAL CASE NO. [NUMBER] OF [YEAR]

[PETITIONER NAME]
... Petitioner
Vs.
[RESPONDENT NAME]
... Respondent

PETITION FOR DIVORCE UNDER SECTION 13(1) OF HINDU MARRIAGE ACT, 1955

The Petitioner above named respectfully submits:

1. That the marriage between the Petitioner and Respondent was solemnized on [DATE] according to Hindu rites and ceremonies at [PLACE].

2. That from the wedlock, [NUMBER] children were born.

3. That the Respondent has treated the Petitioner with cruelty as follows:
   a) [SPECIFIC INSTANCES OF CRUELTY]
   b) [MENTAL HARASSMENT DETAILS]
   c) [OTHER GROUNDS]

4. That all attempts at reconciliation have failed.

5. That there is no collusion between the parties.

PRAYER

In view of the facts stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

a) Grant a decree of divorce dissolving the marriage between the Petitioner and Respondent;

b) Award permanent alimony to the Petitioner;

c) Pass such other and further orders as may be deemed fit and proper.

[PETITIONER NAME]
[ADDRESS]
[CONTACT INFORMATION]`,

  consumerComplaint: `IN THE CONSUMER DISPUTES REDRESSAL COMMISSION, [CITY]

COMPLAINT CASE NO. [NUMBER] OF [YEAR]

[COMPLAINANT NAME]
... Complainant
Vs.
[OPPOSITE PARTY NAME]
... Opposite Party

COMPLAINT UNDER CONSUMER PROTECTION ACT, 2019

The Complainant above named respectfully submits:

1. That the Complainant is a consumer as defined under the Consumer Protection Act, 2019.

2. That the Opposite Party is [DESCRIPTION OF OPPOSITE PARTY] providing services of [SERVICE TYPE].

3. That the Complainant availed services from the Opposite Party on [DATE] for [PURPOSE].

4. That the Opposite Party has committed deficiency in service as follows:
   a) [SPECIFIC DEFICIENCIES]
   b) [FAILURE TO PROVIDE SERVICE]
   c) [NEGLIGENCE DETAILS]

5. That the Complainant suffered losses amounting to ₹[AMOUNT] due to the deficiency.

PRAYER

In view of the facts stated above, it is most respectfully prayed that this Hon'ble Commission may be pleased to:

a) Direct the Opposite Party to refund the amount of ₹[AMOUNT] with interest;

b) Award compensation of ₹[AMOUNT] for mental agony and harassment;

c) Award cost of these proceedings;

d) Pass such other and further orders as may be deemed fit and proper.

[COMPLAINANT NAME]
[ADDRESS]
[CONTACT INFORMATION]`
}

export const getLegalTemplate = (type) => {
  return legalTemplates[type] || ''
}