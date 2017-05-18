for i in `seq 0 1`;
do
    . /root/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/run_local.sh $i
done

chmod 755 -R /root/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/

. /root/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/append_overview.sh
cp /root/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/T*txt /var/www/html/T2/siteReadiness/txtfiles/

