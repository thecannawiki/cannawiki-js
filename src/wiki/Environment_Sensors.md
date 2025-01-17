In order to create the ideal environment for your cultivar, it is essential to be able to accurately measure temperature, humidity, pH, and light intensity. When providing additional Co<sub>2</sub>, a Co<sub>2</sub> sensor is also crucial. The sensors available to the consumer broadly fall into three categories: cheap and generic, DIY sensors for microcontrollers, and expensive "professional" devices. The cheap and generic devices can yield good results but aren't very accurate. Sensors to be used with microcontrollers are equally cheap but much more accurate with the caveat that they require a little electronics knowledge to use. Finally, "professional" devices are very accurate but much more expensive than other options. Generally speaking, the more accurate your sensors are the better growth (and yield) you will be able to achieve. 

## DIY grow controllers ##
A number of grow controllers based on microcontrollers or linux are available online.

* [ESP32EnvironmentController](https://github.com/thecannawiki/ESP32EnvironmentController) Based on ESP32. Supports humidity, temperature, VPD and Co<sub><big>2</big></sub> 
* [SupergreenOS](https://github.com/supergreenlab/SuperGreenOS) Based on espressif ESP32. No longer maintained 

## Humidity and Temperature ##
There is a wide range of generic [humidity and temperature](/Temperature_and_Humidity) sensors that are cheaply available and provide reasonable accuracy. They generally incorporate a small LCD to display current readings and are widely used during curing as they fit inside most mason jars.  

<div align='center'>
 </li>
<img src='/images/Square_sensor.png' width='217px'> </li>
<img src='/images/Round_humidity_sensor.png' width='225px'> </li>

<p align='center'>Some generic examples</p>
</div>

<img src="/images/BME280.png" class="center" width='220px'></img>

More accurate DIY sensors include the BME280 or BME680.

DHT11 and DHT22 are often used to measure temp and humidity but the accuracy of humidity measurements in these sensors is too low to be useful for cultivation.

## Light ##
See [Measuring light intensity](/Light#measuring_light_intensity)

## Carbon Dioxide (Co2) ##
Many generic sensors are not accurate for measuring co2 as they also pick up other volatile compounds, however, the SGP30 sensor is accurate for those willing to take the DIY route.
<img src='/images/Sgp30.png' class="center" width='275px'>


## pH ##
When mixing concentrated liquid nutrients with water it's important to ensure the nutrient mix has the correct pH before applying it to the cultivar so that it can make use of the nutrients (see: nutrient lockout). There is no shortage of generic digital meters to choose from, however, many cheap digital meters are inaccurate and more prone to drift over time. A digital meter should be recalibrated every few months using a buffer solution depending on how heavy the use is. The [grow medium](/Growing_mediums) being used will determine the margin for error for the applied pH in regards to preventing [nutrient lockout.](/Nutrients#nutrient_lockout)

## Total dissolved solids (TDS) ##
A digital TDS meter can tell you how many dissolved solids such as minerals or nutrients are in your water. This can help make sure the right amount of nutrients are provided to the plant