import PropTypes from "prop-types";

export const EntryShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string
});

export const EntriesShape = PropTypes.arrayOf(EntryShape);
