sites=(T2_FI_HIP T2_UK_SGrid_RALPP T2_FR_GRIF_LLR T2_KR_KNU T2_RU_SINP T2_TH_CUNSTDA T2_IT_Bari T2_US_UCSD T1_RU_JINR T2_RU_IHEP T2_RU_RRC_KI T2_CH_CERN T2_CH_CSCS T2_UA_KIPT T2_PK_NCP T2_FR_IPHC T1_US_FNAL T2_IT_Rome T2_UK_London_Brunel T2_US_Vanderbilt T2_EE_Estonia T2_IN_TIFR T2_CN_Beijing T2_US_Florida T1_DE_KIT T2_US_Wisconsin T2_HU_Budapest T2_DE_RWTH T2_BR_SPRACE T2_BR_UERJ T1_UK_RAL T2_ES_IFCA T2_DE_DESY T2_US_Caltech T2_UK_London_IC T2_US_Nebraska T2_ES_CIEMAT T1_IT_CNAF T2_TR_METU T2_AT_Vienna T2_US_Purdue T2_BE_UCL T2_UK_SGrid_Bristol T2_PT_NCG_Lisbon T1_ES_PIC T2_IT_Legnaro T2_RU_INR T2_RU_JINR T2_IT_Pisa T2_GR_Ioannina T2_MY_UPM_BIRUNI T1_FR_CCIN2P3 T2_FR_GRIF_IRFU T2_FR_CCIN2P3 T2_CH_CERN_HLT T2_PL_Warsaw T2_US_MIT T2_BE_IIHE T2_RU_ITEP T2_PL_Swierk
)

for k in "${sites[@]}"; do

    echo "date status" > $k.txt
    for i in $(ls /home/bmaier/T2/site_readiness/MonitoringScripts/output/metrics/siteReadiness/siteReadiness*.txt);
    do

	while read p; do
	    #echo $p
	    
	    status=`echo $p | awk '{print $4}'`
    #echo $status
	    
	    filename=`basename ${i%.*}`
	    date=`echo "${filename:(-10)}"`
	    site=`echo $p | awk '{print $3}'`
	    if [ "$site" == "$k" ]; then
		echo "${date} ${status}" >> $k.txt
	    fi
	done < $i
    done
done