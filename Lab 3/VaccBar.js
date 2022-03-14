function showBarChart() {
    bardata = getTimeData()
    bardata.then(data => {
        let current_data = data['2022-02-22'];
        current_data.sort((a, b) => b.people_vac_per_hundred - a.people_vac_per_hundred);
        top10 = current_data.slice(0, 10);
        line_svg.select('g').transition().duration(5000).attr('transform', 'translate(1000,0)').remove()


        let chosen_value = d => d.people_vac_per_hundred;
    })
}