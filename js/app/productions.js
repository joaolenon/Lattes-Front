var data = {
    chart: {},
    table: {}
};

google.load("visualization", "1", { packages: ["corechart"] });
google.setOnLoadCallback(function() {
    parseQueryString();
    getData(function(data) {
        drawColumnChart(data.chart);
        drawProductionsTable(data.table);
    });

    $('#input-begin').val(queryParams.begin);
    $('#input-end').val(queryParams.end);

    $('#span-begin').text(queryParams.begin);
    $('#span-end').text(queryParams.end);

    getAllGroups(function(groups) {
        var select = $('#input-group');

        for (key in groups) {
            var group = groups[key];
            select.append('<option value="'+group.name+'">'+group.name+'</option>');
        }
    });
});

function getData(endCallback) {
    getGroupMembers(function(group) {
        for(var i = 0; i < group.length; i++) {
            var lattes = group[i],
                user   = getUserData(lattes);

            getProductionData(user.id);
        }

        endCallback(data);
    });
}

function getProductionData(user) {
    var begin    = queryParams.begin,
        end      = queryParams.end,
        jsonData = $.ajax({
            url: 'http://ws-lattes.gopagoda.com/users/'+user+'/productions',
            data: { begin: begin, end: end },
            dataType:"json",
            async: false
        }).responseText;

    var production = JSON.parse(jsonData);

    for(var i = 0; i < production.length; i++) {
        var title  = production[i].title,
            author = production[i].user_id.name,
            type   = production[i].type,
            year   = production[i].year;

        if (data.chart[year] == undefined) {
            data.chart[year] = {
                'Congresso': 0,
                'Capítulos de livros': 0,
                'Livros': 0,
                'Periódicos': 0
            };
        }

        data.chart[year][type]++;

        if (data.table[year] == undefined) {
            data.table[year] = [];
        }

        if (data.table[year][author] == undefined) {
            data.table[year][author] = 0;
        }

        data.table[year][author]++;
    }
}

function drawColumnChart(data) {
    var chartData = [['Ano', 'Congresso', 'Capítulos de livros', 'Livros', 'Periódicos']];
    for(year in data) {
        qnt = [year];
        for(type in data[year]) {
            var value = data[year][type];
            qnt.push(value);
        }

        chartData.push(qnt);
    }

    var data = google.visualization.arrayToDataTable(chartData),
        options = {
            hAxis: { title: 'Ano', titleTextStyle: { color: 'red' } },
            height: 500
        },
        chart = new google.visualization.ColumnChart(document.querySelector('#total-productions .chart'));

    chart.draw(data, options);
}

function drawProductionsTable(data) {
    var table = $('#productions table tbody');

    years = Object.getOwnPropertyNames(data);
    years.sort();
    years.reverse();

    for (var i = 0; i < years.length; i++) {
        var year     = years[i],
            teachers = Object.getOwnPropertyNames(data[year]);

        teachers = jQuery.grep(teachers, function(value) {
            return value != 'length';
        });

        teachers.sort();
        for (var j = 0; j < teachers.length; j++) {
            var teacher = teachers[j],
                count   = data[year][teacher],
                row     = $('<tr></tr>').append('<td>'+teacher+'</td>')
                                        .append('<td style="text-align: center">'+year+'</td>')
                                        .append('<td style="text-align: center">'+count+'</td>');

            table.append(row);
        }
    }
}
