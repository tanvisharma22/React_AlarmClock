var alarms = {}
var curr_id
var snooze_count = {}

// Get today's Date
date_now = Date.now()
today_date = new Date(date_now)
readable_date = today_date.toDateString()

day = readable_date.split(' ')[0]
month = readable_date.split(' ')[1]
date = readable_date.split(' ')[2]
year = readable_date.split(' ')[3]

document.getElementById('date').innerHTML = date + ' ' + month + ' ' + year
document.getElementById('time').innerHTML = today_date.getHours() + ' : ' + today_date.getMinutes() + ' : ' + today_date.getSeconds()

setInterval(() => {
    date_now = Date.now()
    today_date = new Date(date_now)
    document.getElementById('time').innerHTML = today_date.getHours() + ' : ' + today_date.getMinutes() + ' : ' + today_date.getSeconds()
}, 1000);

// Restrict input date to today or after today only
var year = today_date.getFullYear()
var month = (today_date.getMonth() + 1)
var day = today_date.getDate();
var result = year + '-' + month + '-' + day
datepicker = document.getElementById('input-date')
datepicker.setAttribute('min', result)

// Set today's date by default
datepicker.valueAsDate = new Date();

// Appending 24 hours in drop down
for (let i = 0; i < 24; i++) {
    if (i< 10){
        minutes = '0' + String(i)
    }else{
        minutes = String(i)
    }
    html = '<option id=' + minutes + '>'+ minutes +'</option>'
    document.getElementById('set-alarm-hour').innerHTML += html
}

// Appending 60 minutes in drop down
for (let i = 0; i < 60; i++) {
    if (i< 10){
        minutes = '0' + String(i)
    }else{
        minutes = String(i)
    }
    html = '<option id=' + minutes + '>'+ minutes +'</option>'
    document.getElementById('set-alarm-min').innerHTML += html
}

// Appending 60 secs in drop down
for (let i = 0; i < 60; i++) {
    if (i< 10){
        minutes = '0' + String(i)
    }else{
        minutes = String(i)
    }
    html = '<option id=' + minutes + '>'+ minutes +'</option>'
    document.getElementById('set-alarm-sec').innerHTML += html
}

// Setting the alarm
set_alarm_btn = document.getElementsByClassName('alarm-set-btn')[0]
set_alarm_btn.addEventListener('click', function(){
    date = document.getElementById('input-date').value // yyyy-mm-dd
    hour = document.getElementById('set-alarm-hour').value
    min = document.getElementById('set-alarm-min').value
    sec = document.getElementById('set-alarm-sec').value
    alarm_info = [date, hour, min, sec]
    set_alarm(alarm_info)
})

// Making use of classes since all alarms will follow the same blueprint
class setAlarm{
    constructor(time, id) {
        this.time = time;
        this.id = id

        snooze_count[this.id] = 0

        alarms.id = setTimeout(() => {
            // show popup
            document.getElementById('popup').style.display = 'block'
            curr_id = id

        }, time, id);
    }
}

function set_alarm(alarm_info){
    curr_date = String(alarm_info[0])

    curr_date = String(curr_date.split('-')[0]) + String(curr_date.split('-')[1])+ String(curr_date.split('-')[2])

    hour = Number(alarm_info[1])
    min = Number(alarm_info[2])
    sec = Number(alarm_info[3])

    date_now = Date.now()
    today_date = new Date(date_now)

    var year = today_date.getFullYear()
    var month = (today_date.getMonth() + 1)
    var day = today_date.getDate();
    var fulldate = String(year)  + String(month) + String(day)

    // console.log(fulldate, curr_date, curr_date - fulldate)
    diff_date = (curr_date - fulldate)

    if(diff_date == 0 ){
        diff_hr = (hour - today_date.getHours()) * 3600000
        diff_min = (min - today_date.getMinutes()) * 60000
        diff_sec = (sec - today_date.getSeconds()) * 1000
        time = diff_date + diff_hr + diff_min + diff_sec
    }else{
        diff_hr = (hour + (24- today_date.getHours())) * 3600000
        diff_min = (min + (60 - today_date.getMinutes())) * 60000
        diff_sec = (sec + (60 - today_date.getSeconds())) * 1000

        console.log(hour, today_date.getHours(), (24- today_date.getHours()))
        time = diff_date + diff_hr + diff_min + diff_sec
    }


    if (time < 0){
        alert('Please input a time future time')
        return
    }

    id = Math.floor(Math.random() * 10000) // To create unique IDs for each alarm
    new setAlarm(time, id)
    add_in_display_queue(alarm_info, id)
}

// check if there are no alarms, then set this defaut message
document.getElementsByClassName('queue')[0].innerHTML = 'No alarms set yet'

function add_in_display_queue(alarm_info, id){
    count = getSavedAlarms()
    html = `<div class="alarm">
        <span class="alarm-text">#`+ (count + 1) +` Will go off at: `+ alarm_info[1] + ' : ' + alarm_info[2] + ' : ' + alarm_info[3] + ` on ` + alarm_info[0] + `</span><span class="delete-alarm" id="`+ id +`">Delete Alarm</span>
    </div>`
    if(count){
        document.getElementsByClassName('queue')[0].innerHTML += html
    }else{
        document.getElementsByClassName('queue')[0].innerHTML = html
    }

    // Adding functionality to delete button
    add_delete_btn_listener(id)
}

function add_delete_btn_listener(id){
    els = document.getElementsByClassName('alarm')
    count = els.length
    for (let i = 0; i < count; i++) {
        els[i].children[1].addEventListener('click', function(e){
            remove_from_display_queue(e)
            delete_alarm(alarm_info)
        });
    }
}

function getSavedAlarms(){
    alarms = document.querySelectorAll('[class="alarm"]')
    return alarms.length
}

// Deleting alarms
function remove_from_display_queue(e){
    e.target.parentElement.remove()
    if (!getSavedAlarms()){
        document.getElementsByClassName('queue')[0].innerHTML = 'No alarms set yet'
    }
}

function delete_alarm(id){
    delete snooze_count[curr_id]
    clearTimeout(alarms[id])
}

// Popup button ok, close popup
okbtn = document.getElementById('popup-ok')
okbtn.addEventListener('click', function(){
    delete_alarm(curr_id)
    document.getElementById('popup').style.display = 'none'
})

// Snooze functionality
document.getElementById('popup-snooze').addEventListener('click', function(){
    snooze_count[curr_id] += 1
    document.getElementById('popup').style.display = 'none'
    setTimeout(() => {
        console.log(snooze_count[curr_id])
        if (snooze_count[curr_id] < 4){
            document.getElementById('popup').style.display = 'block'
        }
    }, 3000); // Snooze for 5 minutes
})

// Clear button
document.getElementsByClassName('alarm-clear-btn')[0].addEventListener('click', function(){
    document.getElementById('set-alarm-hour').value = '00'
    document.getElementById('set-alarm-min').value = '00'
    document.getElementById('set-alarm-sec').value = '00'
})