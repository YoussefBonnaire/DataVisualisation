file_name_csv = 'vaccinations/vaccinations.csv'
file_name_json = 'vaccinations/vaccinations.json'
formatDate = d3.timeFormat("%Y-%b-%d")


vaccines = d3.csv(file_name_csv, function(d) {
    return {
        date: new Date(d.date),
        iso_code: d.iso_code,
        country: d.location,
        value: d.people_vaccinated_per_hundred
    };
})
console.log(vaccines)
vaccinationsData = vaccines.then(data => data.filter((d) => {
    return !/OWID_/.test(d.iso_code)
}))
console.log(vaccinationsData)
names = vaccinationsData.then(data => new Set(data.map(d => d.country)))
console.log(names)
dates = vaccinationsData.then(data =>
    Array.from(
        d3.rollup(
            data,
            ([d]) => d.value,
            (d) => +d.date,
            (d) => d.country
        )
    )
    .map(([date, data]) => [new Date(date), data])
    .sort(([a], [b]) => d3.ascending(a, b)))
console.log(dates)

function rank(value) {
    const data = names.then(name_data => Array.from(name_data, name => ({ name, value: value(name) })));
    result = data.then(data => {
        data.sort((a, b) => d3.descending(a.value, b.value));
        for (let i = 0; i < data.length; ++i)
            data[i].rank = Math.min(100, i);
        return data;
    })
    return result

}

k = 5
const keyframes = [];
var key = dates.then(data => {
    let ka, a, kb, b;
    for ([
            [ka, a],
            [kb, b]
        ] of d3.pairs(data)) {
        for (let i = 0; i < k; ++i) {
            const t = i / k;
            keyframes.push([
                new Date(ka * (1 - t) + kb * t),
                rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
            ]);
        }
    }
    keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);
    return keyframes
})
console.log(key)