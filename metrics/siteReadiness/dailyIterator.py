from lib import dashboard, sites, url
from datetime import datetime, timedelta
import sys, os
import re
import dateutil.parser
import pytz

# Date for generating the daily Metric value                                                                                                                                                             

start_date = "2017-04-12"                                                                                                                                                                    

formatted_start_date = datetime.strptime(start_date, '%Y-%m-%d')

print formatted_start_date

datetmp = dateutil.parser.parse(start_date, ignoretz=True)

day_before = formatted_start_date - timedelta(days=1)


print day_before
