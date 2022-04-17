import PropTypes from "prop-types";

export const ArchiveShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    state: PropTypes.oneOf(["locked", "unlocked", "pending"]).isRequired
});

export const ArchivesShape = PropTypes.arrayOf(ArchiveShape).isRequired;
