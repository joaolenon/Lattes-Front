google.load("visualization", "1", { packages: ["corechart"] });
google.setOnLoadCallback(function() {
    parseQueryString();
    getData(drawPieChart);

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
        var data = {};

        for(var i = 0; i < group.length; i++) {
            var lattes = group[i],
                user   = getUserData(lattes),
                type   = user.max_titulation;

            if (data[type] == undefined) {
                data[type] = 0;
            }

            if (type == 'Pós-Doutorado') {
                data['Doutorado']++;
                continue;
            }

            data[type]++;
        }

        endCallback(data);
    });
}

function drawPieChart(data) {
    var chartData = [['Titulações', 'Quantidade']];

    for(key in data) {
        var value = data[key];
        chartData.push([key, value]);
    }

    var data = google.visualization.arrayToDataTable(chartData),
        options = {
            height: 500
        },
        chart = new google.visualization.PieChart(document.querySelector('#degree .chart'));
    chart.draw(data, options);
}
