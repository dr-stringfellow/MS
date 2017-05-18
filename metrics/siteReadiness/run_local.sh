
#th that contain this script
cd $(dirname $(readlink -f "${BASH_SOURCE[0]}"))
source /root/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/init.sh
OUT=/root/T2/site_readiness/MonitoringScripts/output/metrics/siteReadiness

if [ ! -d "$OUT" ]; then
    mkdir -p $OUT
fi

date=$(date -I --utc -d "yesterday")
echo "Deleting old file"
#rm -rf /afs/cern.ch/user/c/cmssst/www/siteReadiness/siteReadiness.txt

/usr/bin/python2.6 /root/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/dailyMetric.py $date $OUT ${1}
echo "Succesful run."

#cp $OUT/* /afs/cern.ch/user/c/cmssst/www/siteReadiness/
