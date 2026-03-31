export const buildQuery = ({
  search,
  pagination = {},
  sort,
  filters = {},
  date = {},
  sortSchema = {},
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);

  if (pagination.page) params.append("page", pagination.page.toString());

  if (pagination.perPage)
    params.append("per_page", pagination.perPage.toString());

  if (sort && sortSchema[sort]) {
    params.append("sort_by", sortSchema[sort].by);
    params.append("sort_direction", sortSchema[sort].dir);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.append(key, value.join(","));
      return;
    }

    if (value !== "") {
      params.append(key, value);
    }
  });

  if (date.from)
    params.append("date_from", date.from.toISOString().split("T")[0]);

  if (date.to) params.append("date_to", date.to.toISOString().split("T")[0]);

  return params.toString();
};
