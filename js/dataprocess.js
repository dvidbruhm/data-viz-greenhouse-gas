/* All keys from unprocessed file:

0: "GHG ID No. / No d'identification de GES"
1: "Reference Year / Ann�e de r�f�rence"
2: "Facility Name / Nom de l'installation"
3: "Facility Location / Emplacement de l'installation"
4: "Facility City or District or Municipality / Ville ou District ou Municipalit� de l'installation"
5: "Facility Province or Territory / Province ou territoire de l'installation"
6: "Facility Postal Code / Code postal de l'installation"
7: "Latitude"
8: "Longitude"
9: "Facility NPRI ID / Num�ro d'identification de l'INRP"
10: "Facility NAICS Code / Code SCIAN de l'installation"
11: "French Facility NAICS Code Description / Description du code SCIAN de l'installation en fran�ais"
12: "Reporting Company Legal Name / D�nomination sociale de la soci�t� d�clarante"
13: "Reporting Company Trade Name / Nom commercial de la soci�t� d�clarante"
14: "Public Contact Name / Nom du responsable des renseignements au public"
15: "Public Contact Position / Poste ou Titre du responsable des renseignements au public"
16: "Public Contact Telephone / Num�ro de t�l�phone du responsable des renseignements au public"
17: "Public Contact Extension / Poste t�l�phonique du responsable des renseignements au public"
18: "Public Contact Email / Adresse �lectronique du responsable des renseignements au public"
19: "CO2 (tonnes)"
20: "CO2 (tonnes CO2e / tonnes �q, CO2)"
21: "CH4 (tonnes)"
22: "CH4 (tonnes CO2e / tonnes �q, CO2)"
23: "N2O (tonnes)"
24: "N2O (tonnes CO2e / tonnes �q, CO2)"
25: "HFC-23 (tonnes)"
26: " HFC-23 (tonnes CO2e / tonnes �q, CO2)"
27: "HFC-32 (tonnes)"
28: "HFC-32 (tonnes CO2e / tonnes �q, CO2)"
29: "HFC-125 (tonnes)"
30: "HFC-125 (tonnes CO2e / tonnes �q, CO2)"
31: "HFC-134a (tonnes)"
32: "HFC-134a (tonnes CO2e / tonnes �q, CO2)"
33: "HFC-143a (tonnes)"
34: "HFC-143a (tonnes CO2e / tonnes �q, CO2)"
35: "HFC-152a (tonnes)"
36: "HFC-152a (tonnes CO2e / tonnes �q, CO2)"
37: "HFC-134 (tonnes)"
38: "HFC-134 (tonnes CO2e / tonnes �q, CO2)"
39: "HFC-227ea (tonnes)"
40: "HFC-227ea (tonnes CO2e / tonnes �q, CO2)"
41: "HFC Total (tonnes CO2e / tonnes �q, CO2)"
42: "CF4 (tonnes)"
43: "CF4 (tonnes CO2e / tonnes �q, CO2)"
44: "C2F6 (tonnes)"
45: "C2F6 (tonnes CO2e / tonnes �q, CO2)"
46: "C4F8 (tonnes)"
47: "C4F8 (tonnes CO2e / tonnes �q, CO2)"
48: "PFC Total (tonnes CO2e / tonnes �q, CO2)"
49: "SF6 (tonnes)"
50: "SF6 (tonnes CO2e / tonnes �q, CO2)"
51: "Total Emissions (tonnes CO2e) / �missions totales (tonnes �q, CO2)"
*/

var code_list = []

function cleandata(rawdata){
    var data = [];
    var keys = Object.keys(rawdata[0]);

    rawdata.forEach(element => {
        var d = data.find(x => x.facility_id === element[keys[9]]);
        if (!code_list.includes(element[keys[10]].substring(0, 2)))
        {
            code_list.push(element[keys[10]].substring(0, 2));
        }
        if(!d) // facility not already in list
        {
            data.push(
                {
                    years: [
                        {
                            year: parseInt(element[keys[1]]),
                            total_eq: parseFloat(element[keys[51]]) / 1000 || 0,
                            filtered_total_eq: parseFloat(element[keys[51]]) / 1000 || 0,
                            co2: parseFloat(element[keys[19]]) / 1000 || 0,
                            co2_eq: parseFloat(element[keys[20]]) / 1000 || 0,
                            ch4: parseFloat(element[keys[21]]) / 1000 || 0,
                            ch4_eq: parseFloat(element[keys[22]]) / 1000 || 0,
                            n2o: parseFloat(element[keys[23]]) / 1000 || 0,
                            n2o_eq: parseFloat(element[keys[24]]) / 1000 || 0,
                            hfc23: parseFloat(element[keys[25]]) / 1000 || 0,
                            hfc23_eq: parseFloat(element[keys[26]]) / 1000 || 0,
                            hfc32: parseFloat(element[keys[27]]) / 1000 || 0,
                            hfc32_eq: parseFloat(element[keys[28]]) / 1000 || 0,
                            hfc125: parseFloat(element[keys[29]]) / 1000 || 0,
                            hfc125_eq: parseFloat(element[keys[30]]) / 1000 || 0,
                            hfc134a: parseFloat(element[keys[31]]) / 1000 || 0,
                            hfc134a_eq: parseFloat(element[keys[32]]) / 1000 || 0,
                            hfc143a: parseFloat(element[keys[33]]) / 1000 || 0,
                            hfc143a_eq: parseFloat(element[keys[34]]) / 1000 || 0,
                            hfc152a: parseFloat(element[keys[35]]) / 1000 || 0,
                            hfc152a_eq: parseFloat(element[keys[36]]) / 1000 || 0,
                            hfc134: parseFloat(element[keys[37]]) / 1000 || 0,
                            hfc134_eq: parseFloat(element[keys[38]]) / 1000 || 0,
                            hfc227ea: parseFloat(element[keys[39]]) / 1000 || 0,
                            hfc227ea_eq: parseFloat(element[keys[40]]) / 1000 || 0,
                            hfc_total_eq: parseFloat(element[keys[41]]) / 1000 || 0,
                            cf4: parseFloat(element[keys[42]]) / 1000 || 0,
                            cf4_eq: parseFloat(element[keys[43]]) / 1000 || 0,
                            c2f6: parseFloat(element[keys[44]]) / 1000 || 0,
                            c2f6_eq: parseFloat(element[keys[45]]) / 1000 || 0,
                            c4f8: parseFloat(element[keys[46]]) / 1000 || 0,
                            c4f8_eq: parseFloat(element[keys[47]]) / 1000 || 0,
                            pfc_total_eq: parseFloat(element[keys[48]]) / 1000 || 0,
                            sf6: parseFloat(element[keys[49]]) / 1000 || 0,
                            sf6_eq: parseFloat(element[keys[50]]) / 1000 || 0
                        }
                    ],
                    latitude: parseFloat(element[keys[7]]),
                    longitude: parseFloat(element[keys[8]]),
                    ghg_id: element[keys[0]],
                    facility_name: element[keys[2]],
                    facility_address: element[keys[3]],
                    facility_city: element[keys[4]],
                    facility_province: element[keys[5]],
                    facility_postal_code: element[keys[6]],
                    facility_id: element[keys[9]],
                    facility_code: element[keys[10]].substring(0, 2),
                    facility_code_description: element[keys[11]],
                    company_legal_name: element[keys[12]],
                    company_trade_name: element[keys[13]],
                    contact_name: element[keys[14]],
                    contact_position: element[keys[15]],
                    contact_phone: element[keys[16]],
                    contact_extension: element[keys[17]],
                    contact_email: element[keys[18]],
                }
            );
        }
        else // facility already in list
        {
            var most_recent_year = d3.max(d.years, function(e){
                return e.year;
            });

            if (parseInt(element[keys[1]]) > most_recent_year) {
                d.latitude= parseFloat(element[keys[7]]);
                d.longitude= parseFloat(element[keys[8]]);
                d.ghg_id= element[keys[0]];
                d.facility_name= element[keys[2]];
                d.facility_address= element[keys[3]];
                d.facility_city= element[keys[4]];
                d.facility_province= element[keys[5]];
                d.facility_postal_code= element[keys[6]];
                d.facility_id= element[keys[9]];
                d.facility_code= element[keys[10]].substring(0, 2);
                d.facility_code_description= element[keys[11]];
                d.company_legal_name= element[keys[12]];
                d.company_trade_name= element[keys[13]];
                d.contact_name= element[keys[14]];
                d.contact_position= element[keys[15]];
                d.contact_phone= element[keys[16]];
                d.contact_extension= element[keys[17]];
                d.contact_email= element[keys[18]];
            }
            d.years.push(
                {
                    year: parseInt(element[keys[1]]),
                    total_eq: parseFloat(element[keys[51]]) / 1000 || 0,
                    filtered_total_eq: parseFloat(element[keys[51]]) / 1000 || 0,
                    co2: parseFloat(element[keys[19]]) / 1000 || 0,
                    co2_eq: parseFloat(element[keys[20]]) / 1000 || 0,
                    ch4: parseFloat(element[keys[21]]) / 1000 || 0,
                    ch4_eq: parseFloat(element[keys[22]]) / 1000 || 0,
                    n2o: parseFloat(element[keys[23]]) / 1000 || 0,
                    n2o_eq: parseFloat(element[keys[24]]) / 1000 || 0,
                    hfc23: parseFloat(element[keys[25]]) / 1000 || 0,
                    hfc23_eq: parseFloat(element[keys[26]]) / 1000 || 0,
                    hfc32: parseFloat(element[keys[27]]) / 1000 || 0,
                    hfc32_eq: parseFloat(element[keys[28]]) / 1000 || 0,
                    hfc125: parseFloat(element[keys[29]]) / 1000 || 0,
                    hfc125_eq: parseFloat(element[keys[30]]) / 1000 || 0,
                    hfc134a: parseFloat(element[keys[31]]) / 1000 || 0,
                    hfc134a_eq: parseFloat(element[keys[32]]) / 1000 || 0,
                    hfc143a: parseFloat(element[keys[33]]) / 1000 || 0,
                    hfc143a_eq: parseFloat(element[keys[34]]) / 1000 || 0,
                    hfc152a: parseFloat(element[keys[35]]) / 1000 || 0,
                    hfc152a_eq: parseFloat(element[keys[36]]) / 1000 || 0,
                    hfc134: parseFloat(element[keys[37]]) / 1000 || 0,
                    hfc134_eq: parseFloat(element[keys[38]]) / 1000 || 0,
                    hfc227ea: parseFloat(element[keys[39]]) / 1000 || 0,
                    hfc227ea_eq: parseFloat(element[keys[40]]) / 1000 || 0,
                    hfc_total_eq: parseFloat(element[keys[41]]) / 1000 || 0,
                    cf4: parseFloat(element[keys[42]]) / 1000 || 0,
                    cf4_eq: parseFloat(element[keys[43]]) / 1000 || 0,
                    c2f6: parseFloat(element[keys[44]]) / 1000 || 0,
                    c2f6_eq: parseFloat(element[keys[45]]) / 1000 || 0,
                    c4f8: parseFloat(element[keys[46]]) / 1000 || 0,
                    c4f8_eq: parseFloat(element[keys[47]]) / 1000 || 0,
                    pfc_total_eq: parseFloat(element[keys[48]]) / 1000 || 0,
                    sf6: parseFloat(element[keys[49]]) / 1000 || 0,
                    sf6_eq: parseFloat(element[keys[50]]) / 1000 || 0
                }
            );
        }
    });

    console.log("Finished processing data.");
    return data;
}